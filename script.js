// Tier definitions
    const TIERS = {
      1: { amount: 10000, rate: 0.05 },
      2: { amount: 20000, rate: 0.10 },
      3: { amount: 30000, rate: 0.20 }
    };
    const MAX_MEMBERS = 12;

    // state
    let students = loadFromStorage() || [];

    // elements
    const nameEl = document.getElementById('name');
    const tierEl = document.getElementById('tier');
    const registerBtn = document.getElementById('registerBtn');
    const clearBtn = document.getElementById('clearBtn');
    const membersEl = document.getElementById('members');
    const totalsEl = document.getElementById('totals');
    const formMessage = document.getElementById('formMessage');
    const slotsEl = document.getElementById('slots');
    const simulateWeekBtn = document.getElementById('simulateWeek');
    const resetBtn = document.getElementById('resetBtn');

    // init
    renderAll();

    registerBtn.addEventListener('click', () => {
      const name = nameEl.value.trim();
      const tier = tierEl.value;

      // validations
      if (!name) return showFormMsg('Please enter a student name', true);
      if (!tier) return showFormMsg('Please select a tier', true);
      if (students.length >= MAX_MEMBERS) return showFormMsg('Group is full (12 members)', true);

      // create student
      const amount = TIERS[tier].amount;
      const student = {
        id: cryptoRandomId(),
        name,
        tier: Number(tier),
        amount,
        accumulatedInterest: 0, // interest already added via simulate
        weeks: 0
      };

      students.push(student);
      saveToStorage();
      renderAll();
      clearForm();
      showFormMsg('Student registered successfully');
    });

    clearBtn.addEventListener('click', () => { clearForm(); showFormMsg('Form cleared') });
    resetBtn.addEventListener('click', () => { if(confirm('Reset the entire group? This clears storage.')){ students = []; saveToStorage(); renderAll(); showFormMsg('Reset complete') } });

    simulateWeekBtn.addEventListener('click', () => {
      if (students.length === 0) return showFormMsg('No students to simulate', true);

      students.forEach(s => {
        const rate = TIERS[s.tier].rate;
        const interest = s.amount * rate;
        s.accumulatedInterest += interest;
        s.weeks += 1;
      });
      saveToStorage();
      renderAll();
      showFormMsg('1 week simulated — interest added to everyone');
    });

    // render helpers
    function renderAll(){
      renderTotals();
      renderMembersTable();
      slotsEl.textContent = MAX_MEMBERS - students.length;
    }

    function renderTotals(){
      const totalPrincipal = students.reduce((s, t) => s + t.amount, 0);
      const totalInterest = students.reduce((s, t) => s + t.accumulatedInterest, 0);
      const totalSaved = totalPrincipal + totalInterest;

      totalsEl.innerHTML = `
        <div class="stat">
          <div class="muted">Members</div>
          <div style="font-weight:700;font-size:18px">${students.length} / ${MAX_MEMBERS}</div>
        </div>
        <div class="stat">
          <div class="muted">Total Principal</div>
          <div style="font-weight:700">₦${numberFormat(totalPrincipal)}</div>
        </div>
        <div class="stat">
          <div class="muted">Accumulated Interest</div>
          <div style="font-weight:700">₦${numberFormat(totalInterest)}</div>
        </div>
        <div class="stat">
          <div class="muted">Total Saved</div>
          <div style="font-weight:700">₦${numberFormat(totalSaved)}</div>
        </div>
      `;
    }

    function renderMembersTable(){
      if (students.length === 0){
        membersEl.innerHTML = '<div class="muted" style="margin-top:12px">No members yet. Register students on the left.</div>';
        return;
      }

      let rows = `
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Tier</th>
              <th>Principal</th>
              <th>Weekly Interest</th>
              <th>Accum. Interest</th>
              <th>Withdrawable</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
      `;

      students.forEach((s, idx) => {
        const weeklyInterest = s.amount * TIERS[s.tier].rate;
        const withdrawable = s.amount + s.accumulatedInterest; // already applied weeks
        rows += `
          <tr>
            <td>${idx + 1}</td>
            <td>${escapeHtml(s.name)}</td>
            <td>Tier ${s.tier}</td>
            <td>₦${numberFormat(s.amount)}</td>
            <td>₦${numberFormat(weeklyInterest)} <div class="muted" style="font-size:11px">(${formatPercent(TIERS[s.tier].rate)}/wk)</div></td>
            <td>₦${numberFormat(s.accumulatedInterest)} <div class="muted" style="font-size:11px">(${s.weeks} weeks)</div></td>
            <td>₦${numberFormat(withdrawable)}</td>
            <td class="actions">
              <button onclick="withdrawMember('${s.id}')" class="secondary">Withdraw</button>
            </td>
          </tr>
        `;
      });

      rows += '</tbody></table>';
      membersEl.innerHTML = rows;
    }

    // operations
    window.withdrawMember = function(id){
      const idx = students.findIndex(s => s.id === id);
      if (idx === -1) return alert('Member not found');
      const s = students[idx];
      if (!confirm(`Withdraw ₦${numberFormat(s.amount + s.accumulatedInterest)} for ${s.name}? This will remove them from the group.`)) return;
      students.splice(idx,1);
      saveToStorage();
      renderAll();
      showFormMsg(`${s.name} has withdrawn and left the group`);
    }

    // utils
    function numberFormat(n){ return n.toLocaleString('en-NG') }
    function formatPercent(p){ return Math.round(p*100) + '%' }
    function cryptoRandomId(){ return Math.random().toString(36).slice(2,9) }
    function escapeHtml(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }

    function clearForm(){ nameEl.value = ''; tierEl.value = ''; }
    function showFormMsg(msg, isError=false){ formMessage.textContent = msg; formMessage.style.color = isError ? '#dc2626' : '#111'; setTimeout(()=>{ formMessage.textContent = '' }, 3500) }

    function saveToStorage(){ localStorage.setItem('savings_students_v1', JSON.stringify(students)) }
    function loadFromStorage(){ try{ return JSON.parse(localStorage.getItem('savings_students_v1') || '[]') }catch(e){return []} }
