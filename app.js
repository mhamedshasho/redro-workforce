const STORAGE_KEY = "redro-workforce-v1";
const translations = {
  en: {
    dashboard:"Dashboard",employees:"Employees",branches:"Branches",attendance:"Attendance",reports:"Reports",activity:"Activity log",settings:"Settings",
    localData:"Data stored on this device",overview:"WORKSPACE OVERVIEW",welcome:"Good day.",welcomeSub:"Here is your workforce at a glance.",recordMovement:"Record attendance",
    totalEmployees:"Total employees",acrossBranches:"Across all branches",currentlyPresent:"Currently present",checkedInToday:"Checked in today",lateArrivals:"Late arrivals",lateToday:"Late today",checkedOut:"Checked out",leftToday:"Left today",
    liveOverview:"LIVE OVERVIEW",todaysMovements:"Today's movements",viewAll:"View all",noMovements:"No movements recorded yet",movementHint:"Attendance activity will appear here.",
    getStarted:"GET STARTED",quickAccess:"Quick access",manageEmployees:"Manage employees",manageEmployeesSub:"Add and view employee files",manageBranches:"Manage branches",manageBranchesSub:"Set up work locations",viewReports:"View reports",viewReportsSub:"Review attendance records",offlineFirst:"Offline-first workspace",
    attendanceAction:"ATTENDANCE ACTION",selectEmployee:"Select employee",autoActionHint:"The next valid action is selected automatically.",cancel:"Cancel",confirm:"Confirm",
    noEmployees:"No employees available",checkIn:"Check in",checkOut:"Check out",alreadyComplete:"Today's attendance is complete for this employee.",saved:"Attendance movement recorded.",employeeMissing:"Please select an employee.",present:"Present",left:"Checked out",late:"Late"
  },
  ar: {
    dashboard:"لوحة التحكم",employees:"الموظفون",branches:"الفروع",attendance:"الحضور",reports:"التقارير",activity:"سجل النشاط",settings:"الإعدادات",
    localData:"البيانات محفوظة على هذا الجهاز",overview:"نظرة عامة",welcome:"أهلاً بك.",welcomeSub:"إليك ملخص حالة الموظفين اليوم.",recordMovement:"تسجيل حركة دوام",
    totalEmployees:"إجمالي الموظفين",acrossBranches:"في جميع الفروع",currentlyPresent:"الموجودون حالياً",checkedInToday:"سجّلوا الحضور اليوم",lateArrivals:"حالات التأخير",lateToday:"تأخير اليوم",checkedOut:"غادروا العمل",leftToday:"سجّلوا الانصراف",
    liveOverview:"نظرة مباشرة",todaysMovements:"حركات اليوم",viewAll:"عرض الكل",noMovements:"لا توجد حركات مسجلة بعد",movementHint:"ستظهر حركات الدوام هنا.",
    getStarted:"الوصول السريع",quickAccess:"اختصارات",manageEmployees:"إدارة الموظفين",manageEmployeesSub:"إضافة الموظفين وعرض ملفاتهم",manageBranches:"إدارة الفروع",manageBranchesSub:"إعداد أماكن العمل",viewReports:"عرض التقارير",viewReportsSub:"مراجعة سجلات الدوام",offlineFirst:"يعمل دون اتصال بعد التحميل",
    attendanceAction:"تسجيل حركة دوام",selectEmployee:"اختر الموظف",autoActionHint:"سيحدد النظام الحركة التالية تلقائياً.",cancel:"إلغاء",confirm:"تأكيد",
    noEmployees:"لا يوجد موظفون",checkIn:"تسجيل حضور",checkOut:"تسجيل انصراف",alreadyComplete:"تم إكمال دوام هذا الموظف لليوم.",saved:"تم تسجيل حركة الدوام.",employeeMissing:"يرجى اختيار موظف.",present:"حاضر",left:"منصرف",late:"متأخر"
  }
};
let language = localStorage.getItem("rw-language") || "en";
let state = loadState();
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
function loadState(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {employees:[],branches:[],movements:[]}; }
  catch { return {employees:[],branches:[],movements:[]}; }
}
function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function t(key){ return translations[language][key] || key; }
function todayKey(){ const d=new Date(); return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-"); }
function timeLabel(value){ return new Date(value).toLocaleTimeString(language==="ar"?"ar":"en",{hour:"2-digit",minute:"2-digit"}); }
function applyLanguage(){
  document.documentElement.lang=language;
  document.documentElement.dir=language==="ar"?"rtl":"ltr";
  $$("[data-i18n]").forEach(el=>el.textContent=t(el.dataset.i18n));
  $("#languageButton").textContent=language==="en"?"العربية":"English";
  $("#pageTitle").textContent=t(document.querySelector(".nav-link.active")?.dataset.view || "dashboard");
  renderDashboard();
}
function renderDashboard(){
  const today=todayKey();
  const movements=state.movements.filter(m=>m.date===today);
  const checkedIn=new Set(movements.filter(m=>m.type==="in").map(m=>m.employeeId));
  const checkedOut=new Set(movements.filter(m=>m.type==="out").map(m=>m.employeeId));
  const late=new Set(movements.filter(m=>m.type==="in"&&m.late).map(m=>m.employeeId));
  $("#statEmployees").textContent=state.employees.length;
  $("#statPresent").textContent=[...checkedIn].filter(id=>!checkedOut.has(id)).length;
  $("#statLate").textContent=late.size;
  $("#statOut").textContent=checkedOut.size;
  const root=$("#recentMovements");
  if(!movements.length){root.innerHTML='<div class="empty-state"><span>◷</span><strong data-i18n="noMovements"></strong><p data-i18n="movementHint"></p></div>';root.querySelectorAll("[data-i18n]").forEach(el=>el.textContent=t(el.dataset.i18n));return;}
  root.innerHTML=movements.slice().reverse().slice(0,7).map(m=>{
    const employee=state.employees.find(e=>e.id===m.employeeId);
    return '<div class="movement-item"><span class="movement-dot '+(m.type==="out"?"out":"")+'"></span><div class="movement-info"><strong>'+escapeHtml(employee?.name||"Deleted employee")+'</strong><small>'+ (m.type==="in"?t("checkIn"):t("checkOut"))+(m.late?" · "+t("late"):"")+'</small></div><span class="movement-time">'+timeLabel(m.timestamp)+'</span></div>';
  }).join("");
}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function refreshEmployeeOptions(){
  const select=$("#attendanceEmployee");
  select.innerHTML=state.employees.map(e=>{
    const day=state.movements.filter(m=>m.date===todayKey()&&m.employeeId===e.id);
    const hasIn=day.some(m=>m.type==="in"),hasOut=day.some(m=>m.type==="out");
    const status=hasOut?t("alreadyComplete"):hasIn?t("checkOut"):t("checkIn");
    return '<option value="'+e.id+'" '+(hasOut?"disabled":"")+'>'+escapeHtml(e.name)+' · '+e.id+' — '+status+'</option>';
  }).join("");
  if(!state.employees.length)select.innerHTML='<option value="">'+t("noEmployees")+'</option>';
}
function openAttendance(){
  refreshEmployeeOptions();
  if(!state.employees.length){alert(t("noEmployees"));return;}
  $("#attendanceDialog").showModal();
}
function recordMovement(employeeId){
  const employee=state.employees.find(e=>e.id===employeeId);
  if(!employee)return;
  const day=state.movements.filter(m=>m.date===todayKey()&&m.employeeId===employeeId);
  if(day.some(m=>m.type==="out")){alert(t("alreadyComplete"));return;}
  const type=day.some(m=>m.type==="in")?"out":"in";
  const timestamp=new Date().toISOString();
  let late=false;
  if(type==="in"&&employee.branchId){
    const branch=state.branches.find(b=>b.id===employee.branchId);
    if(branch?.startTime){
      const now=new Date();
      const [h,m]=branch.startTime.split(":").map(Number);
      late=now.getHours()*60+now.getMinutes()>h*60+m;
    }
  }
  state.movements.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),employeeId,type,date:todayKey(),timestamp,late});
  saveState();renderDashboard();$("#attendanceDialog").close();
  const button=$("#quickAttendance");button.blur();
}
function switchView(view){
  $$(".nav-link[data-view]").forEach(el=>el.classList.toggle("active",el.dataset.view===view));
  $("#pageTitle").textContent=t(view);
  $("#sidebar").classList.remove("open");$("#mobileOverlay").classList.remove("show");
  if(view!=="dashboard"){
    $("#viewRoot").innerHTML='<section class="welcome-row"><div><p class="eyebrow">REDRO WORKFORCE</p><h1>'+t(view)+'</h1><p class="muted">'+(language==="ar"?"هذا القسم قيد التجهيز.":"This section is being prepared.")+'</p></div></section><section class="panel"><div class="empty-state"><span>✦</span><strong>'+(language==="ar"?"سيتم بناء هذا القسم ضمن مراحل المشروع التالية":"This module will be built in the next project milestones")+'</strong><p>'+(language==="ar"?"لم تتم إضافة وظائف شكلية أو أزرار غير عاملة.":"No placeholder actions are presented as working features.")+'</p></div></section>';
  }else{
    location.reload();
  }
}
$$(".nav-link[data-view]").forEach(el=>el.addEventListener("click",()=>switchView(el.dataset.view)));
$$("[data-open-view]").forEach(el=>el.addEventListener("click",()=>switchView(el.dataset.openView)));
$("#quickAttendance").addEventListener("click",openAttendance);
$("#attendanceForm").addEventListener("submit",event=>{
  event.preventDefault();
  const id=$("#attendanceEmployee").value;
  if(!id){alert(t("employeeMissing"));return;}
  recordMovement(id);
});
$$(".close-dialog").forEach(el=>el.addEventListener("click",()=>$("#attendanceDialog").close()));
$("#languageButton").addEventListener("click",()=>{language=language==="en"?"ar":"en";localStorage.setItem("rw-language",language);applyLanguage();});
$("#menuButton").addEventListener("click",()=>{$("#sidebar").classList.add("open");$("#mobileOverlay").classList.add("show");});
$("#mobileOverlay").addEventListener("click",()=>{$("#sidebar").classList.remove("open");$("#mobileOverlay").classList.remove("show");});
$("#todayLabel").textContent=new Date().toLocaleDateString(language==="ar"?"ar":"en",{weekday:"short",month:"short",day:"numeric",year:"numeric"});
applyLanguage();
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));