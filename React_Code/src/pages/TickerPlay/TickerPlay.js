import React, { useState , useRef,useEffect, useCallback, useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; 
import {GripVertical,X,ListOrdered , LayoutGrid, List, Trash2, Delete, FolderPlus ,
  MessageSquarePlus, Save, Play, Search, Download, Layers, SatelliteDish , Terminal   } from 'lucide-react';

import { CButton,  CRow,  CCol, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CBadge
 } from '@coreui/react';
 
 import {  
  CCloseButton,
  COffcanvas,
  COffcanvasBody,
  COffcanvasHeader,
  COffcanvasTitle  
} from '@coreui/react';
 
import {TickerPlayService} from "../../services/apiService"; 

import { useTheme } from '../../context/ThemeContext'; 
import { useLoading } from '../../context/LoadingContext'; 
 
import "./TickerPlay.css";

const TickerPlay = () => { 
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

  const [toggleView, setToggleView]       = useState(true); 
  const [activeTabId, setActiveTabId]     = useState("");
  const [tabs,setAllTab]                  = useState([]);
 
  const [alertvisible, setAlertVisible]   = useState(false); 
  const [simplealert,setSimpleAlertVisible] = useState(false);

  const [visible1, setVisible1]   = useState(false);

  const [record, setRecord]	    = useState({});  
  const [visible, setVisible]   = useState(false);
  const [whichbtn,setWhichBtn]  = useState(''); 
  const [tabdata,setTabData]    = useState({});   
 
  const [g_tableId, g_setTableId] = useState(""); 
  const [g_groupId, g_setGroupId] = useState("");
  const [itm_itemId, g_setItemId] = useState("");
  const [message, setMessage]     = useState("");
    
  const [scrollrecord, setScrollRecord]         = useState({});
  const [selecteCheckd, setSelecteCheckdData]   = useState([]);
  const [elementlist, setElementList]           = useState({}); 
  const [elementlisttype, setElementListType]   = useState({}); 
  const [pendingLines, setPendingLines]         = useState([]); 
  const [displayedLines, setDisplayedLines]     = useState([]); 
  const [orderchange, setOrderChange]           = useState(false);

  const [oldselected, setOldSelected]           = useState({});  

  const [editrecord, seEditRecord]         = useState({});
  const [selectedtag,setSelectedTag]       = useState();
  const [selectedtag2,setSelectedTag2]     = useState();
   
   
  const [leftstatus,setLeftStatus] = useState('');

  const [values, setValues]   = useState({});
  const [values2, setValues2] = useState({});
  const [chkflag, setchkFlag] = useState(false); 
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

  const clone = (v) => JSON.parse(JSON.stringify(v));

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
        const response = await TickerPlayService.getActiveScrollList();  
        const tabData = response.data;   
 
        if(tabData.length>0){  
          setAllTab(tabData); 
          setActiveTab(tabData[0].tab); 
          setActiveTabId(tabData[0].id);  

          let finalTables = tabdatastructure;

        if (tabData[0].pooldata && tabData[0].carousaldata) {
          const pooldata = JSON.parse(tabData[0].pooldata);
          const carousaldata = JSON.parse(tabData[0].carousaldata);
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
   setSelected((prev) => {
      const newSelected = { ...prev };
      // Remove all items that belong to this group
      Object.keys(newSelected).forEach((itemId) => {
        const found = tables?.right?.groups?.find((g) => g.id === groupId)?.items?.some((i) => i.id === itemId); 
        if (found) {
          delete newSelected[itemId];
        }
      });
      return newSelected;
    });
  };

  const getCurrentData = async ()=>{ 
    try { 
      if(activeTabId>0){ 
        let tickerdata = {
          id:activeTabId,
          pool: {left:tables['left']},
          caro: {right:tables['right']},
        }
        await TickerPlayService.updatePoolCaroData(tickerdata); 
        setRecordFlag(false);
      } 
    } catch (error) {
      handleError(error); 
    } 
  }  

   const loadTabData = async () => {  
      if(activeTabId>0){ 
        const response = await TickerPlayService.getScrollData(activeTabId);   
        const tabData = response.data;  
       
        setScrollRecord(tabData);
        setActiveTab(tabData[0].tab); 
        setActiveTabId(tabData[0].id); 

        let finalTables = tabdatastructure;

        if (tabData[0].pooldata && tabData[0].carousaldata) {
          const pooldata = JSON.parse(tabData[0].pooldata);
          const carousaldata = JSON.parse(tabData[0].carousaldata);
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
      setSelected({});
    }
  }, [activeTab]); 

  useEffect(() => {
    if(recordflag) {
      getCurrentData();  
    }
  },[recordflag]);
  
  const compareArraysIndexByIndex = (a, b) =>
  Array.isArray(a) &&
  Array.isArray(b) &&
  a.length === b.length &&
  a.every((value, index) => value === b[index]);
 
  const openModal = (table, mode, groupId = null) => {  
    setModal({ open: true, table, mode, targetGroupId: groupId });
    setModalInput("");
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
      copy[modal.table].groups.push({ id: nextId(), name, expanded: true, items: [] });
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
    setModalInputImg(""); 
    setModalSelectTag("");
    setSelectedTag("");
    setValues({});
  }; 
  
  const sortGroups = (tableId) => {
    setLeftStatus(tableId);
    setTables((prev) => {
      const copy = clone(prev);
      if(gsort==='asc'){
        var dir1 = 'desc';
        setGSort('desc');
      }else{
        var dir1 = 'asc';
         setGSort('asc');
      }

      copy[tableId].groups.sort((a, b) => (dir1 === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
      return copy;
    });
    setRecordFlag(true);
    setOrderChange(true);
  };

  const sortRows = (tableId, groupId) => {
    setLeftStatus(tableId);
    setTables((prev) => {
      const copy = clone(prev);
      if(rsort==='asc'){
        var dir1 = 'desc';
        setRSort('desc');
      }else{
        var dir1 = 'asc';
         setRSort('asc');
      }

      const g = copy[tableId].groups.find((gg) => gg.id === groupId);
      if (g) g.items.sort((a, b) => (dir1 === "asc" ? a.text.localeCompare(b.text) : b.text.localeCompare(a.text)));
      return copy;
    });
    setRecordFlag(true);
    setOrderChange(true);
  };

  const deleteGroup = (tableId, groupId) => {  
    
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
 
  const toggleSelect = (itemId) => { 
    setSelected((prev) => {
      const copy = { ...prev };
      if (copy[itemId]) delete copy[itemId];
      else copy[itemId] = true; 
      return copy;
    });  
     
    setCheckboxFlag(true);  
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

      setSelected((s) => {
        const copy = { ...s };
        delete copy[itm_itemId];
        return copy;
      });

    }else{  

      setTables((prev) => {
        const copy = clone(prev);
        copy[g_tableId].groups = copy[g_tableId].groups.filter((gg) => gg.id !== g_groupId);
        return copy;
      });   

      cleanupSelection(g_groupId);
    }

    
    setOrderChange(true);
    setRecordFlag(true);
    setAlertVisible(false); 
    g_setTableId("");
    g_setGroupId("");
    g_setItemId("");
    setMessage("");
  }
  
  const textToEdit = (tableId, group, item)=>{ 
    setLeftStatus(tableId);
    setRecord({
      text: item.text, 
      imgpath:item.imgpath, 
      id:item.id,
      tableId:tableId,
      group:group,
      tag:item.tag
    }); 

    scrollToBottom(); 
    const t =  parseFields(item.tag); 
    const getin = elementlist[activeTab].indexOf(item.tag);  
    setSelectedTag2(elementlisttype[activeTab][getin]); 
    parseFields(elementlisttype[activeTab][getin]).map(({ type, name }, index)=>{ 
      setValues2((prev) => ({ ...prev, [name]: item.imgpath[name] })); 
    });

  }
 
  const cancelSave = (e) => {
     setRecord({}); 
  } 

  const handleSave = (e) => {  
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
      setOrderChange(true);  

      let newData = Object.keys(selected); 
      if(newData.includes(record.id)){
        seEditRecord(record);   
        setEditFlag(true);
      } 
      
      setRecord({}); 
      setValues2({});
  }  
 
  const onDragEnd = (result) => {
    const { source, destination, type } = result;
    if (!destination) return; 

    // GROUP DRAG
    if (type === "GROUP") {
      const sourceTable = source.droppableId;
      const destTable = destination.droppableId;

      
          // Prevent dragging the Default group
          const sourceGroup = tables[sourceTable].groups[source.index];
          if (sourceGroup?.isDefault) { 

            if (sourceTable === "right" && destTable === "right") {

            }else if (sourceTable === "left" && destTable === "left") {
              
            }else{ 
              setMessage("Cannot drag the Default group.");
              setAlertVisible(true); 
              setSimpleAlertVisible(true); 
              return; // Block drag completely
            }
          }  
      

      // If moving from right → left → uncheck all items in this group
      if (sourceTable === "right" && destTable === "left") {
        setSelected((prev) => {
          const newSelected = { ...prev };
          sourceGroup.items.forEach((item) => {
            delete newSelected[item.id];
          });
          return newSelected;
        });
      }

      setTables((prev) => {
        const copy = clone(prev);
        const [moved] = copy[sourceTable].groups.splice(source.index, 1);
        copy[destTable].groups.splice(destination.index, 0, moved);
        return copy;
      });

      //cleanupSelection(sourceGroup.id);
      setRecordFlag(true);
      return;
    }
   
    // ITEM DRAG (unchanged – works perfectly)
    const [sTable, sGroupId] = source.droppableId.split("::");
    const [dTable, dGroupId] = destination.droppableId.split("::");

    const isCrossTable = sTable !== dTable;
    //const willCopy = isCtrlPressed || isCrossTable;

    let movedItemId = null;
    let newItemId = null;

    const willCopy = copyOnDrag; //sTable !== dTable;

    setTables((prev) => {
      const copy = clone(prev);
      const sGroup = copy[sTable].groups.find((g) => g.id === sGroupId);
      const dGroup = copy[dTable].groups.find((g) => g.id === dGroupId);
      if (!sGroup || !dGroup) return prev;

      const sFiltered = filteredMap[`${sTable}::${sGroupId}`] || [];
      const dragged = sFiltered[source.index];
      if (!dragged) return prev;

      const realSrcIdx = sGroup.items.findIndex((i) => i.id === dragged.id);
      const itemObj = sGroup.items[realSrcIdx];

      const draggedItem = sGroup.items[source.index];
      if (!draggedItem) return prev;
      movedItemId = draggedItem.id;

      const newItem = willCopy
        ? { id: nextId(), text: itemObj.text, imgpath: itemObj.imgpath || "", tag: itemObj.tag || "" }
        : itemObj;

      newItemId = newItem.id;  

      if (!willCopy) sGroup.items.splice(realSrcIdx, 1);

      const dFiltered = filteredMap[`${dTable}::${dGroupId}`] || [];
      let insertAt = dGroup.items.length;
      if (destination.index < dFiltered.length) {
        const target = dFiltered[destination.index];
        insertAt = dGroup.items.findIndex((i) => i.id === target.id);
        if (insertAt === -1) insertAt = dGroup.items.length;
      }

      dGroup.items.splice(insertAt, 0, newItem);
      return copy;
    });
 
    // SELECTION LOGIC — The Magic Happens Here
    setSelected((prev) => {
    const updated = { ...prev };
    const wasChecked = !!updated[movedItemId];

    // CASE 1: Moving from right → left → ALWAYS UNCHECK
    if (sTable === "right" && dTable === "left" && !willCopy) {
      delete updated[movedItemId];
      return updated;
    }

    /* 
    // CASE 2: Copying (Ctrl+Drag or cross-table copy)
    if (willCopy) {
      if (wasChecked) {
        updated[newItemId] = true;  // New copy is checked
      }
      // Original stays checked
      return updated;
    }*/

    // CASE 3: Normal move (same side or left→right)
    // Keep checkbox state — no change needed
    return updated;
    });
    
    setCopyOnDrag(willCopy);
    setRecordFlag(true); 
    setOrderChange(true);
  };
  
  useEffect(() => {  
    if(checkboxflag){ 
      let newData = Object.keys(selected); 
        
      const datacrsdata = tabs.filter((item)=>item.id===activeTabId); 
       
      if(datacrsdata[0].carousaldata){
        const currentcarousal = JSON.parse(datacrsdata[0].carousaldata);  
        const allItems = currentcarousal.right.groups.flatMap(group => group.items); 
        const result = allItems.filter(item => newData.includes(item.id)); 
        
        var cmd = result.map((item)=>{
          return `ID- ${item.id} - ${item.text}`; 
        });

        cmd.push("**************************************************************************************");

        setPendingLines(cmd);  
      }
       
      setCheckboxFlag(false);
    }  
  },[selected,checkboxflag]);
 
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
 
  useEffect(() => {
    if(leftstatus==='left') return; 
    if (pendingLines.length === 0) { 
      setIsProcessing(false); 
      return;
    }else{  
     
      const timer = setTimeout( async (i) => { 
        setIsProcessing(true);   
        setIsProcessing(false); 
        if(pendingLines.length > 0) {
          setDisplayedLines((prev) => [...prev, ...pendingLines]);
          setPendingLines([]);
        }  
      }, 1000);  
      
     return () => clearTimeout(timer);
    }   
  }, [pendingLines]);  
 
  const handleBubbleClick = () => {
    setVisible1(true) ; 
  }
  
  
  const parseFields = (pattern) => {
    return pattern.split("^").map((item) => {
      const [type, name] = item.split("_");
      return { type, name };
    });
  }

  return (
    <div className="p-0" ref={bottomRef}> 
        <div className="d-flex justify-content-between align-items-center mb-0"> 
            
              <div style={{width:'45%'}}>
                <h6 className={`txt-${theme.color}`}>Single Drag-Drop  - (500-1000 record support)</h6>   
              </div> 
               <div style={{width:'45%'}}>
                  
               </div>  
 
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
              {  toggleView ? <LayoutGrid size={18} style={{cursor:'pointer'}} />: 
                  <List size={18} style={{cursor:'pointer'}} /> }   
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

        <DragDropContext onDragEnd={onDragEnd}>
        <div className="row g-2">
          {tables &&
            ["left", "right"].map((tableId) => {
              const table = tables[tableId]; 
              const anyExpanded = table.groups.some((g) => g.expanded); 
              return (
                <div key={tableId} className={toggleView ? "col-md-6" : "col-md-12"}>
                   <div className="card" style={{height:'400px'}}> 

                    <div className={`card-header d-flex justify-content-between align-items-center 
                    text-white txt-${theme.color}`} style={{padding:'4px',backgroundColor:"#e1e1e1"}}>

                       <div style={{textAlign:'left', display:'inline-block', paddingLeft:'2%'}}>
                          {tableId && tableId==='left'?<Layers size={18} />:<SatelliteDish size={18} /> }      
                         <strong> {tableId && tableId==='left'? " Left Queue": " Right Queue"}</strong> 
                        
                        </div> 

                         <div style={{textAlign:'center', display:'inline-block'}}>   
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
                          style={{ cursor: anyExpanded ? "pointer" : "not-allowed", opacity: anyExpanded ? 1 : 0.5 }}
                          title="Add Record to first expanded group"
                          onClick={() => {
                            const expanded = table.groups.find((g) => g.expanded);
                            if (expanded) openModal(tableId, "record", expanded.id);
                          }}/>  

                        
                         <ListOrdered  style={{marginLeft:'10px',cursor:'pointer'}} size={20} 
                          onClick={() => sortGroups(tableId)} />   
                      </div>
                    </div>

                    <div className="card-body p-0" style={{ height: "480px", overflowY: "auto" }}>
                      <Droppable droppableId={tableId} type="GROUP">
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef} {...provided.droppableProps}>
                            {table.groups.length === 0 ? (
                              <div className="p-4 text-center text-muted">No groups yet.</div>
                            ) : (
                              table.groups.map((group, gIdx) => {
                                const filteredItems = (group.items || []).filter((i) =>
                                  i.text.toLowerCase().includes((search[tableId] || "").toLowerCase())
                                );

                                return (
                                  <Draggable key={group.id} draggableId={`GROUP::${group.id}`} index={gIdx}>
                                    {(dragProv, dragSnap) => (  
                                        <div
                                          ref={dragProv.innerRef}
                                          {...dragProv.draggableProps}
                                          className="border-bottom"
                                          style={{
                                            ...dragProv.draggableProps.style,
                                            background: dragSnap.isDragging ? "#e3f2fd" : "transparent",
                                            boxShadow: dragSnap.isDragging ? "0 8px 20px rgba(0,0,0,0.2)" : "none",
                                          }}
                                        > 
                                     
                                        {/* Group Header */}
                                        <div
                                          {...dragProv.dragHandleProps}
                                          className="d-flex justify-content-between align-items-center bg-light p-0 border-start border-end"
                                           style={{ cursor: "grab" }}
                                        >
                                          <button
                                            style={{'textDecoration':'none', fontSize:'12px'}}
                                            className="btn btn-link text-dark text-decoration-none d-flex align-items-center gap-1"
                            
                                            onClick={() => toggleExpand(tableId, group.id)}
                                          >
                                            {group.expanded ? "▼" : "▶"} 
                                            <strong>{group.name}</strong> 
                                          </button>
                                          <div className="d-flex gap-2">
                                            <ListOrdered
                                              size={18}
                                              style={{ cursor: "pointer" }}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                sortRows(tableId, group.id);
                                              }}
                                            />
                                            <Trash2
                                              size={18}
                                              style={{ cursor: "pointer", marginRight:'2px' }}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                deleteGroup(tableId, group.id);
                                              }}
                                            />
                                          </div>
                                        </div>

                                        {/* Items */}
                                        {group.expanded && (
                                          <Droppable droppableId={`${tableId}::${group.id}`} type="ITEM">
                                            {(itemProv, itemSnap) => (
                                              <div
                                                ref={itemProv.innerRef}
                                                {...itemProv.droppableProps}
                                                className={itemSnap.isDraggingOver ? "bg-info-subtle" : ""}
                                              >
                                                <table className="table table-sm table-hover mb-0">
                                                  <tbody>
                                                    {filteredItems.length === 0 ? (
                                                      <tr>
                                                        <td colSpan={4} className="text-center text-muted py-3">
                                                          No items
                                                        </td>
                                                      </tr>
                                                    ) : (
                                                      filteredItems.map((item, iIdx) => (
                                                        <Draggable
                                                          key={item.id}
                                                          draggableId={item.id}
                                                          index={iIdx}
                                                        >
                                                          {(iprov, isnap) => (
                                                            <tr
                                                              id={`${item.id}`}
                                                              ref={iprov.innerRef}
                                                              {...iprov.draggableProps}
                                                              style={{
                                                                ...iprov.draggableProps.style,
                                                                background: isnap.isDragging ? "#bbdefb" : "white",
                                                              }}
                                                            >
                                                              <td {...iprov.dragHandleProps} style={{ width: "40px" }}>
                                                                <GripVertical size={16} className="text-muted" />
                                                              </td>
                                                              {tableId === "right" && (
                                                                <td style={{ width: "40px" }}>
                                                                  <input 
                                                                    name={item.id}
                                                                    type="checkbox"
                                                                    className="form-check-input"
                                                                    checked={!!selected[item.id]}
                                                                    onChange={() => toggleSelect(item.id)}
                                                                  />
                                                                </td>
                                                              )}
                                                              <td
                                                                onDoubleClick={() => textToEdit(tableId, group, item)}
                                                                style={{ cursor: "text", textAlign:'left' }}
                                                              >
                                                                {item.text}
                                                              </td>
                                                              <td style={{ width: "50px" }}>
                                                                <X
                                                                  size={16}
                                                                  style={{ cursor: "pointer" }}
                                                                  onClick={() => deleteItem(tableId, group.id, item.id)}
                                                                />
                                                              </td>
                                                            </tr>
                                                          )}
                                                        </Draggable>
                                                      ))
                                                    )}
                                                    {itemProv.placeholder}
                                                  </tbody>
                                                </table>
                                              </div>
                                            )}
                                          </Droppable>
                                        )}
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

                    <div className={`card-footer d-flex justify-content-between align-items-center`}
                  style={{marginTop:'2px', height:'35px'}}>
                     <div style={{'float':'left'}}>
                     <Download  className={`tickerfooter txt-${theme.color}`}
                     size={20} onClick={()=>downloadCSV(tableId)} 
                        style={{marginRight:'3px', cursor:'pointer'}} />  
                      </div>

                      

                      {tableId==='right' && 
                      <div style={{'float':'right',marginTop:'3px'}}> 
 
                        <div className="form-check form-switch d-flex justify-content-center"> 
                          <Terminal  
                            style={{marginRight:'5px',verticalAlign: 'middle',cursor:'pointer'}}
                          stroke-width={4} onClick={handleBubbleClick} />
                          
                        </div> 

                      </div>
                       }
                  </div> 


                  </div>
                </div>
              );
            })}
        </div>
      </DragDropContext>
      
    
      <div className="card" style={{marginTop:'20px',marginBottom:'20px'}}>    
       <div className="row" style={{marginTop:'0px',marginBottom:'5px'}}>  
            <div className="col-12">   
                <div className="">  
                        <div className={`tickerheader txt-${theme.color}`} style={{width:'100%', textAlign:'left',}}>
                            <div style={{display:'inline-block'}}>
                             <i className="fa fa-file"></i>  Item Details 
                            </div> 
                            <div style={{float:'right' , display:'inline-block'}}>  
                                { record.tableId &&  " ("+tables[record.tableId].name+")  " } 
                               
                                <button className={`btn btn-${theme.color} btn-sm`}
                                  style={{color:'#FFF', width:'80px', height:'25px', padding:'0px', marginTop:'-4px'}} type="submit"
                                  disabled={!record.id}
                                   onClick={(e)=>cancelSave(e)}
                                  >
                                  Cancel
                                  </button>

                                <button className={`btn btn-${theme.color} btn-sm`}
                                  style={{marginLeft:'5px', color:'#FFF', width:'80px', height:'25px', padding:'0px', marginTop:'-4px'}} type="submit"
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
                                htmlFor={index}>{type}</label>

                                {name.includes('Txt') && 
                                 <textarea  
                                 key={index}
                                 className="form-control"
                                 name={index}
                                 placeholder={type} 
                                 value={values2[name]}
                                 col={5} 
                                   onChange={(e) =>
                                    setValues2((prev) => ({ ...prev, [name]: e.target.value }))
                                  }
                                />
                              }

                              {!name.includes('Txt') &&
                                <input 
                                  name={index}
                                  key={index}
                                  type="text"
                                  className="form-control"
                                  placeholder={type} 
                                  value={values2[name]}
                                  onChange={(e) =>
                                    setValues2((prev) => ({ ...prev, [name]: e.target.value }))
                                  }
                                />
                              } 
                                 
                            </div>
                            </div>
                          ))}
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
                {modal.table && (modal.mode === "group" ? "Add Group" : "Add Description")} 
                 </CModalTitle> 
               <CButton onClick={() => {setVisible(false);setModalSelectGroup("");}} 
                style={{padding:'0px', marginLeft:modal.table && modal.mode === "group" ? "62%" : "81%" }}> 
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
                              {name.includes('Txt') && 
                                 <textarea  
                                 key={index}
                                 className="form-control"
                                 name={index}
                                 placeholder={type} 
                                 col={5} 
                                   onChange={(e) =>
                                    setValues((prev) => ({ ...prev, [name]: e.target.value }))
                                  }
                                />
                              }

                              {!name.includes('Txt') &&
                                <input 
                                  name={index}
                                  key={index}
                                  type="text"
                                  className="form-control"
                                  placeholder={type} 
                                  onChange={(e) =>
                                    setValues((prev) => ({ ...prev, [name]: e.target.value }))
                                  }
                                />
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
        onClose={() => {setAlertVisible(false);setSimpleAlertVisible(false)}}
        >
        <CModalHeader className={`btn btn-${theme.color}`} 
            closeButton={false}
            style={{padding: '5px 10px',  
            borderBottomLeftRadius:'0px',
            borderBottomRightRadius:'0px'}}>  
            <CModalTitle style={{'fontSize': '1rem'}}>Alert</CModalTitle> 
            <CButton onClick={() => {setAlertVisible(false);setSimpleAlertVisible(false)}} 
            style={{padding:'0px', marginLeft:'88%'}}> 
              <X style={{color:'#FFF',}} />
          </CButton>
        </CModalHeader>
        <CModalBody> 
              {message} 
        </CModalBody>
        <CModalFooter>
        <CButton color="secondary" onClick={() => {setAlertVisible(false); setSimpleAlertVisible(false)}}>
            Close
        </CButton>
          {!simplealert &&
          <CButton   className={`btn btn-${theme.color}`} 
          onClick={removeSelected}>OK</CButton>
           }
        </CModalFooter>
       
      </CModal> 
 

     </div>
      } 

      <COffcanvas 
              placement="bottom"  
              className={visiblefirst?'w-100':'w-100'}
              style={{"height": '50%'}} 
              visible={visible1}  
              onHide={() => setVisible1(false)}>
              <COffcanvasHeader style={{"padding":"5px"}} className={`bg-${theme.color}`}>
              <COffcanvasTitle style={{fontSize:'1rem'}}>Console</COffcanvasTitle>
              <CCloseButton white={visible1} 
              onClick={() => setVisible1(false)} />
              </COffcanvasHeader>
              <COffcanvasBody 
                  ref={textareaRef} 
                  style={{ 
                  textAlign:'left',
                  fontSize:'12px',
                  whiteSpace: 'pre-wrap',		
                  fontFamily: 'monospace',
                  background: "#111", 
                  color: '#0f0'}}> 
                {displayedLines.join('\n\n')}
              </COffcanvasBody>
          </COffcanvas> 

    </div>  
  );
}

export default TickerPlay;