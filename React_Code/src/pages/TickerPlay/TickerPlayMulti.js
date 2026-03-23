import React, { useState , useRef,useEffect, useCallback, useMemo, Fragment } from "react";
import { ChevronDown, ChevronRight } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; 
import {GripVertical,X,ListOrdered , List, LayoutGrid, Trash2, Delete, FolderPlus , Radio,
  MessageSquarePlus, Save, Play, Search, Download, Layers, SatelliteDish    } from 'lucide-react';

import {CTooltip, CImage, CButton,  CRow,  CCol, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CBadge
 } from '@coreui/react';
 
import { FixedSizeList as List2 } from "react-window";


 import {  
  CCloseButton,
  COffcanvas,
  COffcanvasBody,
  COffcanvasHeader,
  COffcanvasTitle  
} from '@coreui/react';

import { Link } from 'react-router-dom';
import {TickerPlayMultiService} from "../../services/apiService";  

import { useTheme } from '../../context/ThemeContext'; 
import { useLoading } from '../../context/LoadingContext';  

import "./TickerPlayMulti.css";

const TickerPlayMulti = () => { 
  const { theme }       = useTheme();  
  const { setLoading }  = useLoading();
  const [visiblefirst, setVisibleSelect] = useState(false);
  const [error, setError]   = useState();   
  const [search, setSearch] = useState({ left: "", right: "" });
  const bottomRef           = useRef(null); // Create a ref
 
  const [isProcessing, setIsProcessing] = useState(false);
  const [copyOnDrag, setCopyOnDrag]     = useState(true);
 
  const textareaRef = React.useRef(null);
  const [activeTab, setActiveTab]         = useState();
 
  const [tables, setTables]               = useState();
  const [recordflag, setRecordFlag]       = useState(false); 
  const [checkboxflag, setCheckboxFlag]   = useState(false);  
  const [editflag, setEditFlag]           = useState(false);  
  // modal control
  const [modal, setModal] = useState({ open: false, mode: null,  table: null, targetGroupId: null, });
  const [modalInput, setModalInput]             = useState("");
  const [modalInputImg, setModalInputImg]       = useState("");
  const [modalSelectGroup, setModalSelectGroup] = useState("");
  const [modalSelectTag, setModalSelectTag]     = useState(""); 
  const modalInputRef           = useRef(null); 
  const [selected, setSelected] = useState({});  
  const [gsort, setGSort]       = useState("asc");
  const [rsort, setRSort]       = useState("asc");

  const [showSearchRight, setShowSearchRight]   = useState(false); 
  const [searchValueRight, setSearchValueRight] = useState("");

  const [toggleView, setToggleView]       = useState(false);
  const detailsPanelRef = useRef(null); 
  const [activeTabId, setActiveTabId]     = useState("");
  const [tabs,setAllTab]                  = useState([]);
 
  const [alertvisible, setAlertVisible]   = useState(false); 
  const [simplealert,setSimpleAlertVisible] = useState(false);

  const [deleteallalert,setDeleteAllAlertVisible] = useState(false);

  const [record, setRecord]	    = useState({});  
  const [visible, setVisible]   = useState(false);
  const [whichbtn,setWhichBtn]  = useState(''); 
  const [tabdata,setTabData]    = useState({});   
 
  const [g_tableId, g_setTableId] = useState(""); 
  const [g_groupId, g_setGroupId] = useState("");
  const [itm_itemId, g_setItemId] = useState("");
  const [message, setMessage]     = useState(""); 
  const [elementlist, setElementList]           = useState({}); 
  const [elementlisttype, setElementListType]   = useState({}); 

  const [pendingLines, setPendingLines]         = useState([]); 
  const [displayedLines, setDisplayedLines]     = useState([]); 
  
  const [orderchange, setOrderChange]           = useState(false);
  const [oldselected, setOldSelected]           = useState({});  

  const [editrecord, seEditRecord]         = useState({});
  const [selectedtag,setSelectedTag]       = useState();
  const [selectedtag2,setSelectedTag2]     = useState();   
  const [leftstatus,setLeftStatus]         = useState(''); 
  const [values, setValues]   = useState({});
  const [values2, setValues2] = useState({});  

  const [previewfile, setFiles] = useState({}); 
  const [selectedforeng, setSelectedForEng] = useState({}); 
  const clone = (v) => JSON.parse(JSON.stringify(v)); 

  let counter = 0;

  const nextId = () => {
    counter = (counter + 1) % 100000;
    return `${Date.now()}${counter}`;
  }; 
   
  const tabdatastructure = { 
      left: {
          id: "left",
          name: "Left Queue",
          groups: [
            { id: 'DEFAULT_LEFT', name:"Default", expanded: true, items: [], isDefault: true }
          ],
        },
        right: {
          id: "right",
          name: "Right Queue",
          groups: [
              { id: 'DEFAULT_RIGHT', name:"Default", expanded: true, items: [], isDefault: true }
          ],
        } 
  };  

  const ensureDefaultGroups = (data) => {
    const result = clone(data || defaultStructure); 
    if (!result.left?.groups?.find((g) => g.id === "DEFAULT_LEFT")) {
      result.left.groups.unshift({ id: "DEFAULT_LEFT", name: "Default", expanded: true, items: [], isDefault: true });
    }
    if (!result.right?.groups?.find((g) => g.id === "DEFAULT_RIGHT")) { 
      result.right.groups.unshift({ id: "DEFAULT_RIGHT", name: "Default", expanded: true, items: [], isDefault: true });
    }
    return result;
  };

  const buildFilteredMap = () => {
    const map = {};
    if(tables)
    ["left", "right"].forEach((t) => {
      const q = (search[t] || "").toLowerCase().trim();
      tables[t].groups.forEach((g) => {
        if (!q) map[`${t}::${g.id}`] = g.items.slice();
        else map[`${t}::${g.id}`] = g.items.filter((it) => it.text.toLowerCase().includes(q) || g.name.toLowerCase().includes(q));
      });
    }); 
    
    return map;
  };
  const filteredMap = buildFilteredMap();
  
  const handleError = async (error) =>{
    if (error.response) { 
      setError(error.response.data.message); 
    } else if (error.request) { 
      setError('Network Error:', error.request);
    } else { 
      setError('Unknown Error:', error.message);
    }
  }  

  const loadFileContent = useCallback(async () => {   
        const response = await TickerPlayMultiService.getActiveScrollList();  
        const tabData = response.data;  
         
 
        if(tabData.length>0){
          setAllTab(tabData); 
          setActiveTab(tabData[0].tab); 
          setActiveTabId(tabData[0].id);  

          let finalTables = tabdatastructure;

        if (tabData[0].pooldata && tabData[0].carousaldata) {
          const pooldata = tabData[0].pooldata;
          const carousaldata = tabData[0].carousaldata; 
          finalTables = ensureDefaultGroups({ left: pooldata.left, right: carousaldata.right });  
        }
        setTabData({[tabData[0].tab]: finalTables});
        setTables(finalTables);
 
         const elements = ['ELEMENT']; 
        setElementList({[tabData[0].tab]:elements});
         
        const elementstype = ['TEXT_Txt']; 
        setElementListType({[tabData[0].tab]:elementstype}); 

        }
  }, []);
  
  useEffect( () => { 
    loadFileContent();  
  },[]);

  // Clean up selected items when group is moved or deleted
  const cleanupSelection = (groupId) => { 

    
    setSelectedForEng(prev => {
      const updated = {};

      // 1. Get all itemIds from the deleted/moved group
      const groupItemIds =
        tables?.right?.groups
          ?.find(g => g.id === groupId)
          ?.items?.map(i => i.id) || [];

      // 2. Remove those itemIds from each engine
      Object.keys(prev).forEach(engineId => {
        const filtered = prev[engineId].filter(
          id => !groupItemIds.includes(id)
        );

        if (filtered.length > 0) {
          updated[engineId] = filtered;
        }
      });

      return updated;
    });

    
  };
 
  const [toggleforeng, setToggleForEng] = useState({});

  const loadTabData = async () => {  
      if(activeTabId>0){ 
        const response = await TickerPlayMultiService.getScrollData(activeTabId);   
        const tabData = response.data;  
         

        let finalTables = tabdatastructure;

        if (tabData[0].pooldata && tabData[0].carousaldata) {
          const pooldata = tabData[0].pooldata;
          const carousaldata = tabData[0].carousaldata;

          finalTables = ensureDefaultGroups({ left: pooldata.left, right: carousaldata.right }); 
        }
        setTabData({[tabData[0].tab]: finalTables});
        setTables(finalTables);  
      
         const elements = ['ELEMENT']; 
        setElementList({[tabData[0].tab]:elements});
         
        const elementstype = ['TEXT_Txt']; 
        setElementListType({[tabData[0].tab]:elementstype});

      } 
  } 
    
  useEffect(() => {  
    if(activeTab){  
      loadTabData();  
      setRecord({});  
      setSelectedForEng({}); 
      setToggleForEng({}); 
    }
  }, [activeTab]); 

  
  
  useEffect(() => {
    if(recordflag) {
        const timerId = setTimeout(() => {
          getCurrentData();  
        },200); 
        return () => {
          clearTimeout(timerId);
        }
     }
  },[recordflag]);

  const getCurrentData = async ()=>{ 
    try { 
      if(activeTabId>0){ 
        let tickerdata = {
          id:activeTabId,
          pool: {left:tables['left']},
          caro: {right:tables['right']},
        }
        await TickerPlayMultiService.updatePoolCaroData(tickerdata); 
        setRecordFlag(false);  
      } 
    } catch (error) {
      handleError(error); 
    } 
  } 
  
  const [engchecked,setEngCheckboxFlag] = useState("");    
   
 
  const openModal = (table, mode, groupId = null) => {  
    setModal({ open: true, table, mode, targetGroupId: groupId });
    setModalInput("");
    setFiles({});
    if(table==='left'){
      setModalSelectGroup('DEFAULT_LEFT');
    }else{
      setModalSelectGroup('DEFAULT_RIGHT');
    }
    // small timeout to focus after render
    setTimeout(() => modalInputRef.current?.focus?.(), 50);
    setVisible(true);
  };  

  const handleAddGroup = () => {
    const name = modalInput.replace("\n", "").replace("\r", "").trim();
    if (!name) return;
    setTables((prev) => {
      const copy = clone(prev);
      copy[modal.table].groups.push({ id: nextId(), name, expanded: true, isDefault:false, items: [] });
      return copy;
    });
    setVisible(false);
    setRecordFlag(true);
  };

  const handleAddRecord = () => { 
 
    const temparr = Object.keys(values); 
    const tagcheck = temparr.filter((itm)=>{ 
       if(itm.includes('Txt')){
        return itm; 
       }
    });

    var text = ""; 
    if(tagcheck && tagcheck.length>0){ 
       text = values[tagcheck[0]];
    }else{
       text = values[temparr[0]]; 
    }

    const img  = values;

    if (!text) return; 
   
    setTables((prev) => {
      const copy = clone(prev);
      const table = copy[modal.table];
      const groupId = modalSelectGroup;
      const tag = modalSelectTag;

      const group = copy[modal.table].groups.find((g) => g.id === groupId);
      if (group) group.items.push({ id: nextId(), text: text, imgpath:img, tag:tag}); 
     
      return copy;
    });
    setRecordFlag(true);
    setModalInput("");
    //setModalSelectGroup(""); 
    setModalInputImg(""); 
    setModalSelectTag("");
    setSelectedTag("");
    setValues({});
  };  

  const deleteGroup = (tableId, groupId) => {  
    setRecord({});
    const group = tables?.[tableId]?.groups?.find((g) => g.id === groupId);
    if (group?.isDefault) {
      setMessage("Cannot delete the Default group.");
      setAlertVisible(true); 
      setSimpleAlertVisible(true);
      return;
    }

    setAlertVisible(true); 
    g_setTableId(tableId);
    g_setGroupId(groupId);
    setMessage("Delete this group and all its items?"); 
    ///if (!window.confirm("Delete this group and all its items?")) return;
     setLeftStatus(tableId); 
  };

  const deleteItem = (tableId, groupId, itemId) => { 
     setRecord({});
    setAlertVisible(true); 
    g_setTableId(tableId);
    g_setGroupId(groupId);
    g_setItemId(itemId); 
    setMessage("Delete this description?"); 
    setLeftStatus(tableId); 
  };
   
  const toggleExpand = (tableId, groupId) => {
    setTables((prev) => {
      const copy = structuredClone(prev);
      const g = copy[tableId].groups.find((x) => x.id === groupId);
      if (g) g.expanded = !g.expanded;
      return copy;
    }); 
    setLeftStatus(tableId);
    setRecordFlag(true);
  }; 
 
   
  const removeSelected = async () => {  

    if(itm_itemId){ 
      setTables((prev) => {
        const copy = clone(prev);
        const g = copy[g_tableId].groups.find((gg) => gg.id === g_groupId);
        if (g) g.items = g.items.filter((it) => it.id !== itm_itemId);
        return copy;
      });

      setSelectedForEng(prev => {
        const updated = {}; 
        Object.keys(prev).forEach(engineId => {
          const filtered = prev[engineId].filter(id => id !== itm_itemId);
          if (filtered.length > 0) {
            updated[engineId] = filtered;
          }
        }); 
        return updated;
      }); 

      //delete item
        try{ 
          await TickerPlayMultiService.deleteTickerItemData({itemid:[itm_itemId]});  
        } catch (error) {
          handleError(error); 
        } 

    }else{  

      setTables((prev) => {
        const copy = clone(prev);
        copy[g_tableId].groups = copy[g_tableId].groups.filter((gg) => gg.id !== g_groupId);
        return copy;
      });   

      cleanupSelection(g_groupId);

      //delete group
        try{ 
            await TickerPlayMultiService.deleteTickerGroup({fileid:activeTabId,gid:g_groupId});  
        } catch (error) {
          handleError(error); 
        } 
      
    }
 
    //setOrderChange(true);
    setRecordFlag(true);
    setAlertVisible(false); 
    g_setTableId("");
    g_setGroupId("");
    g_setItemId("");
    setMessage("");
  }
  
  const textToEdit = (tableId, group, item)=>{ 
    setLeftStatus(tableId);
    
    // Auto-expand details panel if collapsed when editing starts
    if (detailsPanelRef.current) {
      // Check if panel is collapsed (size is at minimum) and expand it
      if (typeof detailsPanelRef.current.resize === 'function') {
        // Get current size - if it's at minSize (15), expand it
        detailsPanelRef.current.resize(25);
      } else if (typeof detailsPanelRef.current.expand === 'function') {
        detailsPanelRef.current.expand();
      }
    }
    
    setRecord({
      text: item.text, 
      imgpath:item.imgpath, 
      id:item.id,
      tableId:tableId,
      group:group,
      tag:item.tag,
      created_by: item.created_by,
      updated_by: item.updated_by,
      created_at:item.created_at,
      updated_at:item.updated_at
    });  

    setFiles({});
    scrollToBottom(); 
    const t =  parseFields(item.tag);  
    
    const getin = elementlist[activeTab].indexOf(item.tag);   

    setSelectedTag2(elementlisttype[activeTab][getin]); 
    parseFields(elementlisttype[activeTab][getin]).map(({ type, name }, index)=>{ 
      setValues2((prev) => ({ ...prev, [name]: item.imgpath[name] })); 
    });

  }
 
  const cancelSave =  (e) => {
     setRecord({}); 
     setLeftStatus("");
     setValues2({});
     setValues({});
  } 

  const handleSave = async (e) => {  

    const temparr = Object.keys(values2); 
    const tagcheck = temparr.filter((itm)=>{ 
       if(itm.includes('Txt')){
        return itm; 
       }
    });

    var text = ""; 
    if(tagcheck && tagcheck.length>0){ 
       text = values2[tagcheck[0]];
    }else{
       text = values2[temparr[0]]; 
    }
     
      setTables(prev => {
        const copy = clone(prev);
        const gg = copy[record.tableId].groups.find(g => g.id === record.group.id); 
        const it = gg.items.find(it => it.id === record.id);
        if (it) 
          it.text = text;
          it.imgpath = values2;
        return copy;
      });  
      
      setRecordFlag(true);
      

      const uniqueItems = [
        ...new Set(Object.values(selectedforeng).flat())
      ];

       

      //selectedforeng
      if(uniqueItems.includes(record.id)){
        seEditRecord(record);   
        setEditFlag(true);
      } 
       

      try{  
        const datapost = {
          itemid: record.id,
          tickertext: values2[tagcheck[0]],
          imgpath: JSON.stringify(values2), 
        } 
        await TickerPlayMultiService.updateTickerData(datapost);  
      } catch (error) {
        handleError(error); 
      }finally{
        setRecord({}); 
        setValues2({});
      }


  }  
     
  const toggleSearchRight = (lftrgt) => {
        setShowSearchRight(prev => !prev);
        setSearchValueRight("");
        setWhichBtn(lftrgt); 
  };
  
  const scrollToBottom = () => {
    
      bottomRef.current.scrollIntoView({
      behavior: 'smooth', // For smooth scrolling
      block: 'end' // Scrolls the element to be at the bottom of the visible area
      }); 
  }; 

  const filterItems = (items, text) =>  items.filter((i) => i.text.toLowerCase().includes(text.toLowerCase())); 
  
  const downloadCSV = (tableId) => {
    const table = tables[tableId];

    let csv = "Group,Item\n";

    table.groups.forEach((g) => {
      g.items.forEach((i) => {
        csv += `${g.name},${i.text}\n`;
      });
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = `${tableId}-table.csv`;
    a.click();
  }; 

  const handleTextChange = (e) => {   
    setRecord((prev) => ({ ...prev, text: e.target.value }));
  }

  const handleImgChange = (e) => {  
    setRecord((prev) => ({ ...prev, imgpath: e.target.value })); 
  };
  
  const [sendtowhchengine, setToWhichEng] = useState();
 
  const handleBubbleClick = () => {
    setVisible1(true) ; 
  }
  
  const parseFields = (pattern) => {
    return pattern.split("^").map((item) => {
      const [type, name] = item.split("_");
      return { type, name };
    });
  }
 
 
const fileRefs = useRef({});
const inputRefs = useRef({});
 
 
   
const ITEM_BATCH_SIZE = 10;
const ITEM_ROW_HEIGHT = 20; // approx row height
const [groupVisibleCount, setGroupVisibleCount] = useState({});

const getVisibleCount = (groupId, total) =>
  groupVisibleCount[groupId] ?? Math.min(ITEM_BATCH_SIZE, total);

const onGroupScroll = (groupId, total) => (e) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target;

  if (scrollTop + clientHeight >= scrollHeight - 20) {
    setGroupVisibleCount(prev => ({
      ...prev,
      [groupId]: Math.min(
        (prev[groupId] || ITEM_BATCH_SIZE) + ITEM_BATCH_SIZE,
        total
      )
    }));
  }
};


const [selectedItemIds, setSelectedItemIds] = useState([]);

const toggleDnDSelection = (itemId) => {
  setSelectedItemIds(prev =>
    prev.includes(itemId)
      ? prev.filter(id => id !== itemId)
      : [...prev, itemId]
  );
};
 
const [draggingTableId, setDraggingTableId] = useState(null);

const onDragEnd = (result) => {
  const { source, destination, type } = result;
  if (!destination) return;

  setRecord({});

  /* ===================== GROUP DRAG ===================== */
  if (type === "GROUP") {
    const sourceTable = source.droppableId;
    const destTable = destination.droppableId;

    const sourceGroup = tables[sourceTable].groups[source.index];

    // ❌ Prevent dragging default group across tables
    if (sourceGroup?.isDefault) {
      if (
        !(
          (sourceTable === "right" && destTable === "right") ||
          (sourceTable === "left" && destTable === "left")
        )
      ) {
        setMessage("Cannot drag the Default group.");
        setAlertVisible(true);
        setSimpleAlertVisible(true);
        return;
      }
    }

    // right → left → uncheck engine selections
    if (sourceTable === "right" && destTable === "left") {
      setSelectedForEng((prev) => {
        const updated = {};
        const itemIdsToRemove = sourceGroup.items.map((i) => i.id);

        Object.keys(prev).forEach((engineId) => {
          const filtered = prev[engineId].filter(
            (id) => !itemIdsToRemove.includes(id)
          );
          if (filtered.length > 0) updated[engineId] = filtered;
        });

        return updated;
      });
    }

    // move group
    setTables((prev) => {
      const copy = clone(prev);
      const [moved] = copy[sourceTable].groups.splice(source.index, 1);
      copy[destTable].groups.splice(destination.index, 0, moved);
      return copy;
    });

    setRecordFlag(true);
    setOrderChange(true);
    return;
  }

  /* ===================== ITEM DRAG ===================== */

  const [sTable, sGroupId] = source.droppableId.split("::");
  const [dTable, dGroupId] = destination.droppableId.split("::");

  const willCopy = sTable !== dTable && copyOnDrag;

  setTables((prev) => {
    const copy = clone(prev);

    const sGroup = copy[sTable].groups.find((g) => g.id === sGroupId);
    const dGroup = copy[dTable].groups.find((g) => g.id === dGroupId);
    if (!sGroup || !dGroup) return prev;

    const sFiltered = filteredMap[`${sTable}::${sGroupId}`] || [];

    /* ---------- MULTI DRAG CORE ---------- */
  /*
    const draggedItems =
      selectedItemIds.length > 0
        ? sFiltered.filter((i) => selectedItemIds.includes(i.id))
        : [sFiltered[source.index]];*/

        const tableSelectedIds = selectedItemIdsByTable[sTable] || [];
        const draggedItems =
          tableSelectedIds.length > 0
            ? sFiltered.filter((i) => tableSelectedIds.includes(i.id))
            : [sFiltered[source.index]];

    if (!draggedItems.length) return prev;

    // real indexes inside source group
    const realIndexes = draggedItems
      .map((item) => sGroup.items.findIndex((i) => i.id === item.id))
      .filter((idx) => idx !== -1)
      .sort((a, b) => a - b);

    /* ---------- REMOVE (only for MOVE) ---------- */
    if (!willCopy) {
      [...realIndexes].reverse().forEach((idx) => {
        sGroup.items.splice(idx, 1);
      });
    }

    /* ---------- CALCULATE INSERT POSITION ---------- */

    const dFiltered = filteredMap[`${dTable}::${dGroupId}`] || [];
    let insertAt = dGroup.items.length;

    const sameGroup = sTable === dTable && sGroupId === dGroupId;

    if (destination.index < dFiltered.length) {
      const targetItem = dFiltered[destination.index];
      const realIdx = dGroup.items.findIndex((i) => i.id === targetItem.id);
      insertAt = realIdx === -1 ? dGroup.items.length : realIdx;
    }

    // adjust index when moving downward inside same group
    if (sameGroup && !willCopy && destination.index > source.index) {
      insertAt -= draggedItems.length - 1;
    }

    /* ---------- PREPARE ITEMS TO INSERT ---------- */

    const itemsToInsert = draggedItems.map((item) =>
      willCopy
        ? {
            id: nextId(),
            text: item.text,
            imgpath: item.imgpath || "",
            tag: item.tag || "",
          }
        : item
    );

    /* ---------- INSERT ---------- */

    dGroup.items.splice(insertAt, 0, ...itemsToInsert);

    return copy;
  });

  /* ===================== ENGINE UNCHECK ===================== */

  setSelectedForEng((prev) => {
    if (!(sTable === "right" && dTable === "left" && !willCopy)) return prev;

    const sFiltered = filteredMap[`${sTable}::${sGroupId}`] || [];

    const draggedIds =
      (selectedItemIdsByTable[sTable] || []).length > 0
        ? sFiltered
            .filter((i) => selectedItemIdsByTable[sTable].includes(i.id))
            .map((i) => i.id)
        : [sFiltered[source.index]?.id];
 
    const updated = {};

    Object.keys(prev).forEach((engineId) => {
      const filtered = prev[engineId].filter((id) => !draggedIds.includes(id));
      if (filtered.length > 0) updated[engineId] = filtered;
    });

    return updated;
  });

  /* ===================== CLEANUP ===================== */

  setRecordFlag(true);
  setOrderChange(true);
  setIsItemDragging(false);
  setDraggingTableId(null);
  setSelectedItemIds([]);

  setSelectedItemIdsByTable((prev) => ({
    ...prev,
    [sTable]: [],
  }));
};

const onDragStart = (start) => {

  if (start.type !== "ITEM") return;

 setIsItemDragging(true);
 const draggedId = start.draggableId;
 const [tableId] = start.source.droppableId.split("::");
  setDraggingTableId(tableId);
  
 setSelectedItemIdsByTable(prev => {
  const tableSelected = prev[tableId] || [];

  if (tableSelected.includes(draggedId)) {
    return prev; // keep multi-select
  }

  return {
    ...prev,
    [tableId]: [draggedId], // reset to single
  };
});
   
};
 
const toggleItemSelect = (tableId, groupId, itemId) => {
  setSelectedItemIdsByTable(prev => {
    const tableSelected = prev[tableId] || [];

    // Find group of first selected item in THIS table
    let currentGroupId = null;

    if (tableSelected.length > 0) {
      const firstSelectedId = tableSelected[0];

      const group = tables[tableId].groups.find(g =>
        g.items.some(i => i.id === firstSelectedId)
      );

      currentGroupId = group?.id || null;
    }

    let updatedCurrent;

    // ⭐ If selecting from DIFFERENT group → reset current table
    if (currentGroupId && currentGroupId !== groupId) {
      updatedCurrent = [itemId];
    } else {
      // Normal toggle inside same group
      if (tableSelected.includes(itemId)) {
        updatedCurrent = tableSelected.filter(id => id !== itemId);
      } else {
        updatedCurrent = [...tableSelected, itemId];
      }
    }

    // ⭐ GLOBAL RULE → clear OTHER table completely
    const otherTableId = tableId === "left" ? "right" : "left";

    return {
      ...prev,
      [tableId]: updatedCurrent,
      [otherTableId]: []   // 🔥 reset other table
    };
  });

  
};

const [isItemDragging, setIsItemDragging] = useState(false);
const [selectedItemIdsByTable, setSelectedItemIdsByTable] = useState({
  left: [],
  right: []
});

const removeGlobalSelected = async () => { 
    const tableId = whichgroup;
    const idsToDelete = selectedItemIdsByTable[tableId];
 
  if (idsToDelete.length === 0) return;

  setTables(prev => {
    const copy = clone(prev);

    copy[tableId].groups.forEach(group => {
      group.items = group.items.filter(
        item => !idsToDelete.includes(item.id)
      );
    });

    return copy;
  });

  // engine cleanup only for right table
  if (tableId === "right") {
    setSelectedForEng(prev => {
      const updated = {};
      Object.keys(prev).forEach(engineId => {
        const filtered = prev[engineId].filter(
          id => !idsToDelete.includes(id)
        );
        if (filtered.length > 0) updated[engineId] = filtered;
      });
      return updated;
    });
  }

  setSelectedItemIdsByTable(prev => ({
    ...prev,
    [tableId]: []
  }));

  try{ 
    await TickerPlayMultiService.deleteTickerItemData({itemid:idsToDelete});  

    setRecordFlag(true);
    setOrderChange(true);

  } catch (error) {
    handleError(error); 
  }finally{
    setWhichGroupItem("");
    setAlertVisible(false);  
    setDeleteAllAlertVisible(false);
  }  
}

const [whichgroup, setWhichGroupItem] = useState();

const deleteSelectedInTable = async (tableId) => {
    setWhichGroupItem(tableId);
    setAlertVisible(true);  
    setDeleteAllAlertVisible(true);
    setMessage("Are you sure you want to delete selected items?");  
}; 

  return (
    <div className="p-0" ref={bottomRef}> 
        <div className="d-flex justify-content-between align-items-center mb-0">  
              <div style={{width:'45%'}}>
                <h6 className={`txt-${theme.color}`}>Multi Drag-Drop - (Bulk record support)</h6>   
              </div> 
               <div style={{width:'45%'}}></div>   
        </div>    
        
        {tabs && tabs.length>0 && 
        <div className="d-flex justify-content-between" style={{'float':'right'}}>  
            <div className={`txt-${theme.color}`} style={{'float':'left',  
              'paddingRight':'40px'}}>
                <label className="form-check-label ms-2" htmlFor="copyOnDrag" 
              style={{verticalAlign :'text-top', fontSize:'12px',}}>
                Copy on Drag
              </label>

              <input
              style={{marginLeft:'10px'}}
                  className="form-check-input" 
                type="checkbox"
                checked={copyOnDrag}
                onChange={(e) => setCopyOnDrag(e.target.checked)}
                id="copyOnDrag"
              /> 
              </div>

          <div className={`txt-${theme.color}`} style={{'float':'right','padding':'0px'}}
          onClick={(e) => {setToggleView(!toggleView);}}>
              {  toggleView ? <List size={18} style={{cursor:'pointer'}} />: 
                  <LayoutGrid size={18} style={{cursor:'pointer'}} /> }   
          </div>  
                
        </div> 
      }
            
      {tabs && tabs.length>0 && 
          <ul className="nav nav-tabs mb-2"> 
            {tabs.map((t,index) => (   
              <li className={`nav-item txt-${theme.color}`} key={t.id} > 
                <button
                  style={{padding: '2px 10px 2px 10px' }}
                  className={`nav-link ${activeTab === t.tab ? `active  bg-${theme.color}` : `txt-${theme.color}`}`}
                  onClick={() => {setActiveTab(t.tab); setActiveTabId(t.id)}}>
                  {t.tab} 
                </button>
              </li>
            ))}
          </ul>   
      } 
       
      {tabs && tabs.length>0 &&    
      <div className="">
         <div className="row g-2">
            <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}> 
            {tables &&
              ["left", "right"].map((tableId, idx) => {
                  const table = tables[tableId]; 
                  const anyExpanded = table.groups.some((g) => g.expanded); 
    
                  return ( 
                    <div key={tableId} className={toggleView ? "col-md-12" : "col-md-6"}> 
                    <div className="card" style={{ marginBottom:'0', display: 'flex', flexDirection: 'column', minHeight: 0}}> 

                    <div className={`card-header d-flex justify-content-between align-items-center 
                                        text-white txt-${theme.color}`} style={{padding:'4px',backgroundColor:"#e1e1e1"}}>
                    
                                           <div style={{textAlign:'left', display:'inline-block', paddingLeft:'2%'}}>
                                              {tableId && tableId==='left'?<Layers size={18} />:<SatelliteDish size={18} /> }      
                                             <strong> {tableId && tableId==='left'? " Left Queue": " Right Queue"}</strong> 
                                            
                                            </div> 
                    
                                             
                                               <div style={{display:'flex', alignItems:'center', justifyContent:'flex-end', gap:'10px', flex:'0 0 auto'}}>  
                                              {selectedItemIdsByTable[tableId]?.length > 0 && (
                                                <><Trash2 
                                                size={18}
                                                onClick={()=>deleteSelectedInTable(tableId)}
                                                style={{cursor:'pointer'}}></Trash2>
                                                  ({selectedItemIdsByTable[tableId].length})
                                                </>
                                              )}   
                                                                      
                                             {showSearchRight && whichbtn===tableId ? ( 
                                                <input 
                                                style={{"marginRight":'10px',
                                                     "fontSize": "0.575rem"}}
                                                className="form-control form-control-sm" 
                                                autoFocus   
                                                id={`searchBox${tableId}`}
                                                type="text"
                                                placeholder="Search..." 
                                                value={search[tableId] || ""} 
                                                onChange={(e) => setSearch({ ...search, [tableId]: e.target.value })}
                                                />   
                                            
                                            ):(<></>)}
                                            </div>
                    
                                          <div style={{textAlign:'center', display:'inline-block'}}>   
                                         
                                             <Search  
                                              title="Search"
                                              style={{marginLeft:'10px',"marginRight":'10px', cursor:'pointer'}}
                                              onClick={()=>toggleSearchRight(tableId)}  /> 
                                             
                                            <FolderPlus className="ms-2" size={24} style={{ cursor: "pointer" }}
                                              title="Add Group" onClick={() => openModal(tableId, "group")} />     
                    
                                            <MessageSquarePlus
                                              className="ms-2"
                                              size={24}
                                              style={{ cursor:  "pointer"}}
                                              title="Add Record to first expanded group"
                                              onClick={() => {
                                                //const expanded = table.groups.find((g) => g.expanded);
                                                openModal(tableId, "record", null);
                                              }}/> 

                                              <Download  className={`tickerfooter txt-${theme.color}`}
                                              size={20} onClick={()=>downloadCSV(tableId)} 
                                              style={{cursor:'pointer'}} /> 
                      
                                          </div>
                                        </div>

                    


                    <div className="card-body p-0" style={{ flex: '1', overflowY: "auto", minHeight: 0 }}> 
                      <Droppable droppableId={tableId} type="GROUP">
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef} {...provided.droppableProps}>
                            {table.groups.length === 0 ? (
                              <div className="p-4 text-center text-muted">No groups yet.</div>
                            ) : (
                                  table.groups.map((group, gIdx) => { 
                                
                            const visibleItems1 = filteredMap[`${tableId}::${group.id}`] || group.items; 
                            const visibleIds = visibleItems1.map(i => i.id); 

                            const tableSelected = selectedItemIdsByTable[tableId] || [];

                            const selectedCount = visibleIds.filter(id => tableSelected.includes(id)).length;

                            const allSelected = visibleIds.length > 0 && selectedCount === visibleIds.length;

                            const someSelected = selectedCount > 0 && !allSelected; 
                            
                            const toggleSelectAll = (e) => { 
                                setSelectedItemIdsByTable(prev => {
                                  const otherTableId = tableId === "left" ? "right" : "left"; 
                                  return {
                                    ...prev,
                                    [tableId]: allSelected ? [] : [...visibleIds],
                                    [otherTableId]: [] // 🔥 reset other table
                                  };
                              }); 
                            }; 

                            const filteredItems = (group.items || []).filter((i) =>
                              i.text.toLowerCase().includes((search[tableId] || "").toLowerCase())
                            );  
                              return (
                                  <Draggable key={group.id} draggableId={`GROUP::${group.id}`} index={gIdx}>
                                   {(dragProv, dragSnap) => (  
                                      <div
                                        ref={dragProv.innerRef}
                                        {...dragProv.draggableProps}
                                        style={{
                                          ...dragProv.draggableProps.style,
                                          background: dragSnap.isDragging ? "#e3f2fd" : "transparent",
                                          boxShadow: dragSnap.isDragging ? "0 8px 20px rgba(0,0,0,0.2)" : "none",
                                        }}
                                      >  
                                    
                                      {/* Group Header */}
                                      <div
                                        {...dragProv.dragHandleProps}
                                        className="d-flex justify-content-between align-items-center bg-light group-header"
                                          style={{ cursor: "grab", padding:'10px 16px' }}
                                      >

                                        <div style={{marginLeft:'-12px',width:'0.5%',float:'left'}}>
                                          <input 
                                            type="checkbox"
                                            checked={allSelected}
                                              ref={el => {
                                                if (el) el.indeterminate = someSelected;
                                              }}
                                              onChange={toggleSelectAll} 
                                          />
                                        </div>    

                                        <div style={{width:group.isDefault?'97%':'94%',float:'left'}}>
                                          <button
                                            style={{'textDecoration':'none', fontSize:'13px', padding:'0', border:'none', background:'transparent'}}
                                            className="btn btn-link text-dark text-decoration-none d-flex align-items-center gap-2"
                                            onClick={() => toggleExpand(tableId, group.id)}
                                          >
                                            {group.expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />} 
                                            <strong>{group.name}</strong> 
                                          </button>
                                        </div>

                                        <div className="d-flex gap-2 align-items-center group-delete-button"> 
                                          {!group.isDefault &&
                                          <X
                                            size={18}
                                            style={{ cursor: "pointer" }}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              deleteGroup(tableId, group.id);
                                            }}
                                          />
                                          } 
                                        </div>
                                      </div>

                                      {/* Items */}

                        {group.expanded ? (

                            <Droppable
                            droppableId={`${tableId}::${group.id}`}
                            type="ITEM"
                            mode="virtual"
                            renderClone={(provided, snapshot, rubric) => {
                              const item = filteredItems[rubric.source.index];
                              
                              return (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                    height: 48,
                                    display: "flex",
                                    alignItems: "left",
                                    background: "#bbdefb",
                                    padding: "0 12px",
                                    borderLeft: "4px solid #1976d2",
                                    textAlign:'left', 
                                    overflow: "hidden", 
                                    whiteSpace: "nowrap", 
                                    textOverflow: "ellipsis" 
                                  }}
                                >
                                  {item.text}

                                  {selectedCount > 1 && (
                                <span
                                  style={{
                                    position: "absolute",
                                    top: 4,
                                    right: 8,
                                    background: "#1976d2",
                                    color: "#fff",
                                    fontSize: 12,
                                    padding: "2px 6px",
                                    borderRadius: 4
                                  }}
                                >
                                  {selectedCount}
                                </span>
                              )}
                                </div>
                              );
                            }}
                            >
                            {(itemProv, itemSnap) => {
                              const selectedIds = selectedItemIdsByTable[tableId] || [];
                              const selectedCount = draggingTableId
                                ? selectedItemIdsByTable[draggingTableId]?.length || 0
                                : 0;

                              const Row = ({ index, style }) => {
                                const item = filteredItems[index];
                                const isSelected = selectedIds.includes(item.id);

                        return (
                          <Draggable
                            draggableId={item.id}
                            index={index}
                            key={item.id}
                          >
                            {(iprov, isnap) => (
                              <div
                                className="queue-item-row"
                                ref={iprov.innerRef}
                                {...iprov.draggableProps}
                                {...iprov.dragHandleProps}
                                style={{
                                  ...style,
                                  ...iprov.draggableProps.style,
                                  display: "flex",
                                  alignItems: "left",
                                  background: isnap.isDragging
                                    ? "#bbdefb"
                                    : isSelected
                                    ? "#e3f2fd"
                                    : "white",
                                  borderLeft: isSelected
                                    ? "4px solid #1976d2"
                                    : "4px solid transparent",
                                  padding: "0 12px",
                                  boxSizing: "border-box"
                                }}
                              >
                                {/* Checkbox */}
                                <div style={{ width: "5%" }}>
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(e) =>
                                      toggleItemSelect(tableId, group.id, item.id, e)
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>

                                

                                {/* TEXT */}
                                <div
                                {...iprov.dragHandleProps}
                                className="position-relative"
                                  style={{ flex: 1, cursor: "text", 
                                      textAlign:'left', 
                                      overflow: "hidden", 
                                      whiteSpace: "nowrap", 
                                      textOverflow: "ellipsis" }}
                                      onDoubleClick={() => {
                                        setRecord({});
                                        setLeftStatus("");
                                        setValues2({});
                                        setValues({});
                                        textToEdit(tableId, group, item);
                                      }}
                                    title={item.text}
                                  >
                                  
                                  {item.text}
                                </div>

                                
                                {/* DELETE */}
                                <div className="delete-button-cell" style={{ width: "5%", padding:'8px 12px', verticalAlign:'top'}} >
                                  <X
                                    size={16}
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      deleteItem(tableId, group.id, item.id)
                                    }
                                  />
                                </div>
                              </div>
                            )}
                          </Draggable>
                          );
                        };

                              return (
                                <div
                                  ref={itemProv.innerRef}
                                  className={
                                    itemSnap.isDraggingOver ? "bg-info-subtle" : ""
                                  }
                                  style={{
                                    height: 200,
                                    width: "100%"
                                  }}
                                >
                                  <List2 
                                    height={200}
                                    itemCount={filteredItems.length}
                                    itemSize={30}
                                    width="100%"
                                    outerRef={itemProv.innerRef}
                                  >
                                    {Row}
                                  </List2>
                                </div>
                              );
                      }}
                        
                      </Droppable>
                      
                      ):(<></>)
                      
                      } 

                        </div>
                                   )}
                                  </Draggable>
                                    );
                                  })
                                  
                            )}
                            {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            </div>  
                          </div> 
                        </div>  
                      );
                  })} 
                </DragDropContext>
      </div> 
          
          
      <div className="card" style={{marginTop:'20px',marginBottom:'0', display:'block', height: '100%', overflowY: 'auto', overflowX: 'hidden'}}>    
       <div className="row" style={{marginTop:'0px',marginBottom:'5px'}}>  
            <div className="col-12">   
                <div className="">  
                        <div className={`tickerheader txt-${theme.color}`} style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'5px 12px'}}>
                            <div style={{display:'flex', alignItems:'center'}}>
                             <i className="fa fa-file"></i>  <span style={{marginLeft:'8px'}}>Item Details</span>
                            </div> 
                            <div style={{display:'flex', alignItems:'center', gap:'8px'}}>  
                                { record.tableId &&  <span style={{marginRight:'4px'}}>{"("+tables[record.tableId].name+")"}</span> } 
                               
                                <button className={`btn btn-${theme.color} btn-sm ${!record.id ? 'disabled' : ''}`}
                                   type="submit"
                                  disabled={!record.id}
                                   onClick={(e)=>cancelSave(e)}
                                  >
                                  Cancel
                                  </button>

                                <button className={`btn btn-${theme.color} btn-sm ${!record.id ? 'disabled' : ''}`}
                                   type="submit"
                                  disabled={!record.id}
                                  onClick={(e)=>handleSave(e)}
                                  >
                                  Update
                                  </button> 

                            </div>
                        </div>   

                    {!record.id && (
                    <div className="tickermainbodyDataFrame" style={{padding:'20px', textAlign:'left',}}>  
                      <CRow className="align-items-center">   
                        <CCol xs="12" className="">
                          <label className="form-label"  
                          htmlFor={`scrolltext-${activeTabId}`}>Description</label>
                          <textarea id={`scrolltext-${activeTabId}`}  
                              readOnly
                              cols={5} 
                              autoComplete="off"
                              placeholder="Enter Description"
                              className="form-control form-control-sm"  
                              type="text"    />  
                        </CCol>   
                      </CRow>    
                        </div>
                      )}    

                      {record.id && selectedtag2 && (   
                      <div className="tickermainbodyDataFrame" style={{padding:'20px', textAlign:'left',}}> 
                        
                      <CRow className="align-items-center"> 
 

                          {parseFields(selectedtag2).map(({ type, name }, index) => (
                            <div className="col-12" key={index}> 
                             

                            <div className="mb-1">  
                              <label className="form-label"  
                                htmlFor={index}>{name}</label>

                                {type.includes('TEXT') && 
                                 <textarea  
                                 key={index}
                                 className="form-control"
                                 name={index}
                                 placeholder={name} 
                                 value={values2[name]}
                                 col={5} 
                                   onChange={(e) =>
                                    setValues2((prev) => ({ ...prev, [name]: e.target.value }))
                                  }
                                />
                              }
                               

                              {!type.includes('TEXT') &&
                              <div style={{display:'flex'}}>
                                <input 
                                  name={index}
                                  key={index}
                                  type="text" 
                                  autoComplete="off"
                                  ref={el => (inputRefs.current[name] = el)}
                                  className="form-control"
                                  style={{marginRight:'10px'}}
                                  placeholder={name} 
                                  value={values2[name]}
                                  onChange={(e) =>
                                    setValues2((prev) => ({ ...prev, [name]: e.target.value }))
                                  }
                                /> 
                                 
                               
                            </div>

                            } 
 
                                 
                            </div>
                            </div>
                          ))}

                         <div className="col-12">
                            <div className="mb-1">  
                                <label className="form-label">Created By: {record.created_by}</label> 
                            </div> 
                          </div>

                          <div className="col-12">
                            <div className="mb-1">  
                                <label className="form-label">Created At: {new Date(record.created_at).toLocaleString('en-US', { hour12: false })}
                                  </label> 
                            </div>
                            
                          </div>

                          <div className="col-12">
                            <div className="mb-1">  
                                <label className="form-label">Updated By: {record.updated_by}</label> 
                            </div> 
                          </div>

                          <div className="col-12">
                            <div className="mb-1">  
                                <label className="form-label">Updated At: {new Date(record.updated_at).toLocaleString('en-US', { hour12: false})}
                                </label>
                            </div>
                          </div>
                      
                      </CRow>
                          </div>
                      )} 
                        
                    </div>    
            </div> 
        </div>
      </div> 
            
      <CModal
          size={modal.table && (modal.mode === "group" ? "sm" : "lg")} 
          scrollable 
          backdrop="static"
          visible={visible}
          onClose={() => {setVisible(false);setModalSelectGroup("");}}>
          <CModalHeader className={`btn btn-${theme.color}`} 
               closeButton={false}
              style={{padding: '5px 10px',  
              borderBottomLeftRadius:'0px',
              borderBottomRightRadius:'0px'}}>  
              <CModalTitle style={{'fontSize': '1rem'}}> 
                {modal.table && (modal.mode === "group" ? "Add Group" : "Add Element")} 
                 </CModalTitle> 
               <CButton onClick={() => {setVisible(false);setModalSelectGroup("");}} 
                style={{padding:'0px', marginLeft:modal.table && modal.mode === "group" ? "60%" : "81%" }}> 
                  <X style={{color:'#FFF',}} />
              </CButton> 
          </CModalHeader>
          <CModalBody> 
                {modal.mode === "group" ? (
                  <input ref={modalInputRef} name="gname"
                  className="form-control" placeholder="Group name"
                   value={modalInput} onChange={(e) => setModalInput(e.target.value)} />
                ) : (
                  <div className="row">
                      <div className="col-12">
                      <label className="form-label small" htmlFor="tgroup">Target group</label>
                     
                      <select className="form-select mb-2"  required  id="tgroup"
                      value={modalSelectGroup} onChange={(e) => setModalSelectGroup(e.target.value)}>
                        <option value="">-- Select --</option>
                        {modal.table && tables[modal.table].groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                      </select>
                      </div>

                      <div className="col-12"> 
                      <label className="form-label small" htmlFor="tagtype">Tag Type</label>
                      <select className="form-select mb-2"  required  id="tagtype"
                       value={modalSelectTag} onChange={(e) => {
                         setValues({}); 
                        setModalSelectTag(e.target.value); 
                          if(e.target.selectedIndex>0){
                            const getttype = elementlisttype[activeTab][e.target.selectedIndex-1];
                            setSelectedTag(getttype);
                          }else{
                            setSelectedTag("");  
                          }
                        }}>
                        <option value="">-- Select --</option>
                          {elementlist[activeTab] && elementlist[activeTab].map((el,index) =>{
                              return (<option value={el} data-key={index}  key={index}>{el}</option>);
                          })
                        }  
                      </select> 
                      </div>
                     
                     {selectedtag && ( 
                        <>
                          {parseFields(selectedtag).map(({ type, name }, index) => (
                            <div className="col-12" key={index}> <div className="mb-1">
                              {type.includes('TEXT') && 
                                 <textarea  
                                 key={index}
                                 className="form-control"
                                 name={index}
                                 placeholder={name} 
                                 col={5} 
                                   onChange={(e) =>
                                    setValues((prev) => ({ ...prev, [name]: e.target.value }))
                                  }
                                />
                              }

                              {!type.includes('TEXT') &&
                              <div style={{display:'flex'}}>
                                <input 
                                  name={index}
                                  key={index}
                                  type="text" 
                                  ref={el => (inputRefs.current[name] = el)}
                                  className="form-control"
                                  style={{marginRight:'10px'}}
                                  placeholder={name} 
                                  onChange={(e) =>
                                    setValues((prev) => ({ ...prev, [name]: e.target.value }))
                                  }
                                /> 
                                 
 
                              </div>

                              } 
                            </div></div>
                          ))}
                        </>
                      )} 
                    
                  </div>
                )}
          </CModalBody>
          <CModalFooter>
          <CButton color="secondary" onClick={() => {setVisible(false);setModalSelectGroup("");}}>
              Close
          </CButton>
          <CButton   className={`btn btn-${theme.color}`} 
          disabled={ (!modalSelectGroup && modal.mode !== "group")  || 
            (modal.table && tables[modal.table].groups.filter(element => element.name === modalInput).length>0)  
          }
          onClick={modal.mode === "group" ? handleAddGroup : handleAddRecord}>Save</CButton>
          </CModalFooter>
      </CModal>     
                
      <CModal
        backdrop="static"
        visible={alertvisible}
        onClose={() => {
           setWhichGroupItem("");
          setAlertVisible(false);
          setSimpleAlertVisible(false);
          setDeleteAllAlertVisible(false)}}
        >
        <CModalHeader className={`btn btn-${theme.color}`} 
            closeButton={false}
            style={{padding: '5px 10px',  
            borderBottomLeftRadius:'0px',
            borderBottomRightRadius:'0px'}}>  
            <CModalTitle style={{'fontSize': '1rem'}}>Alert</CModalTitle> 
            <CButton onClick={() => {
              setWhichGroupItem("");
              setAlertVisible(false);
              setSimpleAlertVisible(false);
              setDeleteAllAlertVisible(false)}} 
            style={{padding:'0px', marginLeft:'88%'}}> 
              <X style={{color:'#FFF',}} />
          </CButton>
        </CModalHeader>
        <CModalBody> 
              {message} 
        </CModalBody>
        <CModalFooter>
        <CButton color="secondary" onClick={() => {
              setWhichGroupItem("");
              setAlertVisible(false); 
              setSimpleAlertVisible(false);
              setDeleteAllAlertVisible(false)}}>
            Close
        </CButton>
          {!simplealert && !deleteallalert &&
          <CButton   className={`btn btn-${theme.color}`} 
          onClick={removeSelected}>OK</CButton>
           }

           {deleteallalert &&
          <CButton   className={`btn btn-${theme.color}`} 
          onClick={removeGlobalSelected}>OK</CButton>
           }
           
        </CModalFooter>
       
      </CModal>  

     </div>
    }  

    </div>  
  );
}

export default TickerPlayMulti; 