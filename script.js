const records = [
  {account:'Disney', type:'Stockout Risk', score:88, rating:'High', action:'Confirm replenishment order, notify vendor, and escalate if evidence is not attached within 24 hours.'},
  {account:'Universal Studios', type:'Documentation Control Gap', score:72, rating:'High', action:'Attach reorder approval and vendor confirmation before the next client status update.'},
  {account:'SeaWorld', type:'Client Reporting Risk', score:63, rating:'Medium', action:'Generate updated stakeholder summary and confirm reporting owner before due date.'},
  {account:'Disney', type:'Vendor Follow-up Risk', score:51, rating:'Medium', action:'Create backlog task for overdue vendor response and add escalation deadline.'},
  {account:'Universal Studios', type:'Monitoring', score:22, rating:'Low', action:'Continue weekly review; no escalation required unless inventory falls below threshold.'},
  {account:'SeaWorld', type:'Stockout Risk', score:91, rating:'High', action:'Prioritize replenishment review and prepare leadership summary for open stockout exposure.'}
];
function render(filter='All'){
 const body=document.querySelector('#riskTable tbody');
 body.innerHTML='';
 records.filter(r=>filter==='All'||r.rating===filter).forEach(r=>{
   const tr=document.createElement('tr');
   tr.innerHTML=`<td>${r.account}</td><td>${r.type}</td><td>${r.score}</td><td><span class="badge ${r.rating}">${r.rating}</span></td><td>${r.action}</td>`;
   body.appendChild(tr);
 });
}
document.querySelectorAll('.table-tools button').forEach(btn=>btn.addEventListener('click',()=>{
 document.querySelectorAll('.table-tools button').forEach(b=>b.classList.remove('active'));
 btn.classList.add('active'); render(btn.dataset.filter);
}));
render();
