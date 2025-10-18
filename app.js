const STORAGE_KEY = 'stabilix-erp-state-v1';

const SEED_STATE = {
  sales: [
    {
      id: 'sale-001',
      opportunity: 'Acme Manufacturing - Modernization Suite',
      customer: 'Acme Manufacturing',
      amount: 48500,
      stage: 'Negotiation',
      probability: 0.6,
      owner: 'Jordan Blake',
      closeDate: '2024-04-18'
    },
    {
      id: 'sale-002',
      opportunity: 'Globex Distribution - Supply Chain Automation',
      customer: 'Globex Distribution',
      amount: 78250,
      stage: 'Proposal',
      probability: 0.45,
      owner: 'Priya Nair',
      closeDate: '2024-05-02'
    },
    {
      id: 'sale-003',
      opportunity: 'Blue Horizon Foods - Production Analytics',
      customer: 'Blue Horizon Foods',
      amount: 61200,
      stage: 'Closed Won',
      probability: 1,
      owner: 'Alex Murphy',
      closeDate: '2024-03-22'
    }
  ],
  inventory: [
    {
      id: 'inv-001',
      sku: 'STB-CTRL-01',
      name: 'Stabilix Control Module',
      onHand: 68,
      reorderPoint: 40,
      unitCost: 1280,
      vendor: 'Northwind Circuits'
    },
    {
      id: 'inv-002',
      sku: 'STB-SENS-08',
      name: 'Smart Sensor Array',
      onHand: 24,
      reorderPoint: 30,
      unitCost: 880,
      vendor: 'Aurora Components'
    },
    {
      id: 'inv-003',
      sku: 'STB-GTW-04',
      name: 'IoT Gateway',
      onHand: 94,
      reorderPoint: 50,
      unitCost: 1420,
      vendor: 'Magellan Hardware'
    }
  ],
  employees: [
    {
      id: 'emp-001',
      name: 'Mia Park',
      department: 'Operations',
      role: 'ERP Administrator',
      startDate: '2022-10-02',
      status: 'Active'
    },
    {
      id: 'emp-002',
      name: 'Diego Alvarez',
      department: 'Finance',
      role: 'Controller',
      startDate: '2021-03-15',
      status: 'Active'
    },
    {
      id: 'emp-003',
      name: 'Hannah Lee',
      department: 'Sales',
      role: 'Enterprise AE',
      startDate: '2023-01-09',
      status: 'Active'
    },
    {
      id: 'emp-004',
      name: 'Marcus Chen',
      department: 'Operations',
      role: 'Production Planner',
      startDate: '2020-06-01',
      status: 'On leave'
    }
  ],
  tasks: [
    {
      id: 'task-001',
      name: 'Quarterly demand planning review',
      owner: 'Operations',
      dueDate: '2024-05-05',
      status: 'In progress'
    },
    {
      id: 'task-002',
      name: 'Close April financials',
      owner: 'Finance',
      dueDate: '2024-05-02',
      status: 'Scheduled'
    },
    {
      id: 'task-003',
      name: 'Launch new partner onboarding',
      owner: 'Sales Enablement',
      dueDate: '2024-04-29',
      status: 'Complete'
    }
  ]
};

const storage = (() => {
  try {
    if (typeof window !== 'undefined' && 'localStorage' in window) {
      const testKey = '__stabilix_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return window.localStorage;
    }
  } catch (error) {
    console.warn('Local storage is not available. Data will not persist between sessions.', error);
  }
  return null;
})();

const clone = (value) => JSON.parse(JSON.stringify(value));

function loadState() {
  if (!storage) {
    return clone(SEED_STATE);
  }

  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) {
    const seeded = clone(SEED_STATE);
    storage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }

  try {
    const parsed = JSON.parse(raw);
    return { ...clone(SEED_STATE), ...parsed };
  } catch (error) {
    console.error('Unable to parse ERP data, falling back to defaults.', error);
    return clone(SEED_STATE);
  }
}

function saveState() {
  if (storage) {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}

function formatDate(isoDate) {
  if (!isoDate) return '—';
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(isoDate));
}

function calculateInventoryValue(item) {
  return item.onHand * item.unitCost;
}

function probabilityColor(probability) {
  if (probability >= 0.75) return 'success';
  if (probability <= 0.3) return 'danger';
  return '';
}

let state = loadState();
let currentView = 'dashboard';

const content = document.getElementById('content');
const navButtons = document.querySelectorAll('.nav-button');
const toast = document.getElementById('toast');
const dateIndicator = document.getElementById('date-indicator');
const yearIndicator = document.getElementById('year');

yearIndicator.textContent = new Date().getFullYear();
updateDateIndicator();
setInterval(updateDateIndicator, 1000 * 60);

navButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const view = button.dataset.view;
    setActiveNav(view);
    renderView(view);
  });
});

renderView('dashboard');

function updateDateIndicator() {
  dateIndicator.textContent = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }).format(new Date());
}

function setActiveNav(view) {
  currentView = view;
  navButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.view === view);
  });
}

function renderView(view) {
  const views = {
    dashboard: renderDashboard,
    sales: renderSales,
    inventory: renderInventory,
    hr: renderWorkforce,
    reports: renderReports
  };

  const renderFn = views[view] || views.dashboard;
  renderFn();
  requestAnimationFrame(() => content.focus());
}

function renderDashboard() {
  const totalPipeline = state.sales.reduce((sum, sale) => sum + sale.amount, 0);
  const wonRevenue = state.sales
    .filter((sale) => sale.stage === 'Closed Won')
    .reduce((sum, sale) => sum + sale.amount, 0);
  const forecast = state.sales.reduce((sum, sale) => sum + sale.amount * sale.probability, 0);
  const outstandingDeals = state.sales.filter((sale) => sale.stage !== 'Closed Won' && sale.stage !== 'Closed Lost').length;
  const activeEmployees = state.employees.filter((employee) => employee.status === 'Active').length;
  const inventoryValue = state.inventory.reduce((sum, item) => sum + calculateInventoryValue(item), 0);
  const reorderAlerts = state.inventory.filter((item) => item.onHand <= item.reorderPoint);
  const upcomingTasks = clone(state.tasks)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 4);

  content.innerHTML = `
    <section class="view view-dashboard">
      <div class="section-heading">
        <h2>Executive Overview</h2>
        <p>Real-time visibility across the Stabilix value chain.</p>
      </div>

      <div class="card-grid">
        <article class="card" aria-label="Pipeline value">
          <h3>Total pipeline</h3>
          <strong>${formatCurrency(totalPipeline)}</strong>
          <span class="badge-pill">${outstandingDeals} open opportunities</span>
        </article>
        <article class="card" aria-label="Revenue forecast">
          <h3>Forecast</h3>
          <strong>${formatCurrency(Math.round(forecast))}</strong>
          <span class="badge-pill">Won revenue ${formatCurrency(wonRevenue)}</span>
        </article>
        <article class="card" aria-label="Workforce active">
          <h3>Active workforce</h3>
          <strong>${activeEmployees}</strong>
          <span class="badge-pill">${state.employees.length} total employees</span>
        </article>
        <article class="card" aria-label="Inventory value">
          <h3>Inventory on hand</h3>
          <strong>${formatCurrency(inventoryValue)}</strong>
          <span class="badge-pill">${reorderAlerts.length} reorder alerts</span>
        </article>
      </div>

      <div class="section-heading">
        <h2>Operational priorities</h2>
        <p>Focus on critical tasks and supply signals.</p>
      </div>

      <div class="card-grid">
        <section aria-label="Upcoming work">
          <h3>Upcoming work</h3>
          ${
            upcomingTasks.length
              ? `<div class="list-grid">${upcomingTasks
                  .map(
                    (task) => `
                      <div class="list-item">
                        <div>
                          <strong>${task.name}</strong>
                          <span>${task.owner}</span>
                        </div>
                        <span>${formatDate(task.dueDate)}</span>
                      </div>
                    `
                  )
                  .join('')}</div>`
              : '<p class="empty-state">All caught up! Schedule a new task to see it here.</p>'
          }
        </section>
        <section aria-label="Supply alerts">
          <h3>Supply alerts</h3>
          ${
            reorderAlerts.length
              ? `<div class="list-grid">${reorderAlerts
                  .map(
                    (item) => `
                      <div class="list-item">
                        <div>
                          <strong>${item.name}</strong>
                          <span>${item.sku}</span>
                        </div>
                        <span class="status-chip danger">${item.onHand} on hand</span>
                      </div>
                    `
                  )
                  .join('')}</div>`
              : '<p class="empty-state">All inventory levels are healthy.</p>'
          }
        </section>
      </div>
    </section>
  `;
}

function renderSales() {
  content.innerHTML = `
    <section class="view view-sales">
      <div>
        <div class="section-heading">
          <h2>Sales pipeline</h2>
          <p>Manage opportunities from qualification to close.</p>
        </div>
        <form class="data-form" id="sale-form">
          <div class="form-grid">
            <label>
              Opportunity name
              <input name="opportunity" required placeholder="Enterprise deployment" />
            </label>
            <label>
              Customer
              <input name="customer" required placeholder="Customer name" />
            </label>
            <label>
              Amount (USD)
              <input name="amount" type="number" min="0" step="100" required />
            </label>
            <label>
              Stage
              <select name="stage" required>
                <option value="Qualification">Qualification</option>
                <option value="Discovery">Discovery</option>
                <option value="Proposal">Proposal</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Closed Won">Closed Won</option>
                <option value="Closed Lost">Closed Lost</option>
              </select>
            </label>
            <label>
              Probability (%)
              <input name="probability" type="number" min="0" max="100" step="5" value="50" required />
            </label>
            <label>
              Owner
              <input name="owner" required placeholder="Deal owner" />
            </label>
            <label>
              Target close date
              <input name="closeDate" type="date" required />
            </label>
          </div>
          <button type="submit">Add opportunity</button>
        </form>
      </div>

      <div class="table-wrapper">
        <table id="sales-table">
          <thead>
            <tr>
              <th>Opportunity</th>
              <th>Stage</th>
              <th>Probability</th>
              <th>Amount</th>
              <th>Close date</th>
              <th>Owner</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${
              state.sales.length
                ? state.sales
                    .map(
                      (sale) => `
                        <tr>
                          <td>
                            <strong>${sale.opportunity}</strong>
                            <div class="muted">${sale.customer}</div>
                          </td>
                          <td><span class="status-chip ${stageClass(sale.stage)}">${sale.stage}</span></td>
                          <td><span class="status-chip ${probabilityColor(sale.probability)}">${Math.round(
                        sale.probability * 100
                      )}%</span></td>
                          <td>${formatCurrency(sale.amount)}</td>
                          <td>${formatDate(sale.closeDate)}</td>
                          <td>${sale.owner}</td>
                          <td>
                            <button type="button" class="action-button" data-action="delete-sale" data-id="${sale.id}">Remove</button>
                          </td>
                        </tr>
                      `
                    )
                    .join('')
                : `<tr><td colspan="7"><p class="empty-state">Start by logging your first opportunity.</p></td></tr>`
            }
          </tbody>
        </table>
      </div>
    </section>
  `;

  const saleForm = document.getElementById('sale-form');
  saleForm.addEventListener('submit', handleSaleSubmit);
  document.getElementById('sales-table').addEventListener('click', handleSaleTableClick);
}

function stageClass(stage) {
  if (stage === 'Closed Won') return 'success';
  if (stage === 'Closed Lost') return 'danger';
  return '';
}

function handleSaleSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const newSale = {
    id: createId('sale'),
    opportunity: formData.get('opportunity'),
    customer: formData.get('customer'),
    amount: Number(formData.get('amount')),
    stage: formData.get('stage'),
    probability: Number(formData.get('probability')) / 100,
    owner: formData.get('owner'),
    closeDate: formData.get('closeDate')
  };

  state.sales = [newSale, ...state.sales];
  saveState();
  showToast('Opportunity added to the pipeline');
  renderSales();
}

function handleSaleTableClick(event) {
  const button = event.target.closest('button[data-action="delete-sale"]');
  if (!button) return;
  const id = button.dataset.id;
  state.sales = state.sales.filter((sale) => sale.id !== id);
  saveState();
  showToast('Opportunity removed');
  renderSales();
}

function renderInventory() {
  content.innerHTML = `
    <section class="view view-inventory">
      <div>
        <div class="section-heading">
          <h2>Inventory control</h2>
          <p>Monitor stock positions and vendor performance.</p>
        </div>
        <form class="data-form" id="inventory-form">
          <div class="form-grid">
            <label>
              SKU
              <input name="sku" required placeholder="STB-" />
            </label>
            <label>
              Item name
              <input name="name" required placeholder="Component" />
            </label>
            <label>
              Vendor
              <input name="vendor" required placeholder="Preferred supplier" />
            </label>
            <label>
              On hand
              <input name="onHand" type="number" min="0" step="1" required />
            </label>
            <label>
              Reorder point
              <input name="reorderPoint" type="number" min="0" step="1" required />
            </label>
            <label>
              Unit cost (USD)
              <input name="unitCost" type="number" min="0" step="1" required />
            </label>
          </div>
          <button type="submit">Add item</button>
        </form>
      </div>

      <div class="table-wrapper">
        <table id="inventory-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>SKU</th>
              <th>On hand</th>
              <th>Reorder point</th>
              <th>Unit cost</th>
              <th>Value</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${
              state.inventory.length
                ? state.inventory
                    .map(
                      (item) => `
                        <tr>
                          <td><strong>${item.name}</strong><div class="muted">${item.vendor}</div></td>
                          <td>${item.sku}</td>
                          <td>${item.onHand}</td>
                          <td>${item.reorderPoint}</td>
                          <td>${formatCurrency(item.unitCost)}</td>
                          <td>${formatCurrency(calculateInventoryValue(item))}</td>
                          <td>
                            <span class="status-chip ${item.onHand <= item.reorderPoint ? 'danger' : 'success'}">
                              ${item.onHand <= item.reorderPoint ? 'Reorder' : 'Healthy'}
                            </span>
                          </td>
                          <td>
                            <button type="button" class="action-button" data-action="delete-item" data-id="${item.id}">Remove</button>
                          </td>
                        </tr>
                      `
                    )
                    .join('')
                : `<tr><td colspan="8"><p class="empty-state">Inventory will appear as you add items.</p></td></tr>`
            }
          </tbody>
        </table>
      </div>
    </section>
  `;

  document.getElementById('inventory-form').addEventListener('submit', handleInventorySubmit);
  document.getElementById('inventory-table').addEventListener('click', handleInventoryTableClick);
}

function handleInventorySubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const newItem = {
    id: createId('inv'),
    sku: formData.get('sku'),
    name: formData.get('name'),
    vendor: formData.get('vendor'),
    onHand: Number(formData.get('onHand')),
    reorderPoint: Number(formData.get('reorderPoint')),
    unitCost: Number(formData.get('unitCost'))
  };

  state.inventory = [newItem, ...state.inventory];
  saveState();
  showToast('Inventory item created');
  renderInventory();
}

function handleInventoryTableClick(event) {
  const button = event.target.closest('button[data-action="delete-item"]');
  if (!button) return;
  const id = button.dataset.id;
  state.inventory = state.inventory.filter((item) => item.id !== id);
  saveState();
  showToast('Inventory item removed');
  renderInventory();
}

function renderWorkforce() {
  content.innerHTML = `
    <section class="view view-hr">
      <div>
        <div class="section-heading">
          <h2>Workforce</h2>
          <p>Track team composition, tenure, and status changes.</p>
        </div>
        <form class="data-form" id="employee-form">
          <div class="form-grid">
            <label>
              Full name
              <input name="name" required placeholder="Employee name" />
            </label>
            <label>
              Department
              <input name="department" required placeholder="Department" />
            </label>
            <label>
              Role
              <input name="role" required placeholder="Title" />
            </label>
            <label>
              Start date
              <input name="startDate" type="date" required />
            </label>
            <label>
              Status
              <select name="status" required>
                <option value="Active">Active</option>
                <option value="On leave">On leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </label>
          </div>
          <button type="submit">Add employee</button>
        </form>
      </div>

      <div class="table-wrapper">
        <table id="employee-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Role</th>
              <th>Start date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${
              state.employees.length
                ? state.employees
                    .map(
                      (employee) => `
                        <tr>
                          <td><strong>${employee.name}</strong></td>
                          <td>${employee.department}</td>
                          <td>${employee.role}</td>
                          <td>${formatDate(employee.startDate)}</td>
                          <td><span class="status-chip ${employee.status === 'Active' ? 'success' : ''}">${employee.status}</span></td>
                          <td>
                            <button type="button" class="action-button" data-action="delete-employee" data-id="${employee.id}">Remove</button>
                          </td>
                        </tr>
                      `
                    )
                    .join('')
                : `<tr><td colspan="6"><p class="empty-state">Add team members to build your workforce directory.</p></td></tr>`
            }
          </tbody>
        </table>
      </div>
    </section>
  `;

  document.getElementById('employee-form').addEventListener('submit', handleEmployeeSubmit);
  document.getElementById('employee-table').addEventListener('click', handleEmployeeTableClick);
}

function handleEmployeeSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const employee = {
    id: createId('emp'),
    name: formData.get('name'),
    department: formData.get('department'),
    role: formData.get('role'),
    startDate: formData.get('startDate'),
    status: formData.get('status')
  };

  state.employees = [employee, ...state.employees];
  saveState();
  showToast('Employee added');
  renderWorkforce();
}

function handleEmployeeTableClick(event) {
  const button = event.target.closest('button[data-action="delete-employee"]');
  if (!button) return;
  const id = button.dataset.id;
  state.employees = state.employees.filter((employee) => employee.id !== id);
  saveState();
  showToast('Employee removed');
  renderWorkforce();
}

function renderReports() {
  const pipelineByStage = groupBy(state.sales, (sale) => sale.stage);
  const headcountByDepartment = groupBy(state.employees, (employee) => employee.department);
  const inventoryByVendor = groupBy(state.inventory, (item) => item.vendor);
  const forecast = state.sales.reduce((sum, sale) => sum + sale.amount * sale.probability, 0);
  const averageTenureMonths = calculateAverageTenure(state.employees);
  const openTasks = state.tasks.filter((task) => task.status !== 'Complete');

  const salesByStageMarkup = renderTagListFromMap(
    pipelineByStage,
    ([stage, deals]) => `<li>${stage}: ${formatCurrency(deals.reduce((sum, deal) => sum + deal.amount, 0))}</li>`,
    'Add opportunities to populate this view.'
  );
  const headcountMarkup = renderTagListFromMap(
    headcountByDepartment,
    ([department, employees]) => `<li>${department}: ${employees.length}</li>`,
    'Add team members to view departmental totals.'
  );
  const vendorMarkup = renderTagListFromMap(
    inventoryByVendor,
    ([vendor, items]) => `<li>${vendor}: ${formatCurrency(items.reduce((sum, item) => sum + calculateInventoryValue(item), 0))}</li>`,
    'Add inventory items to calculate vendor spend.'
  );

  content.innerHTML = `
    <section class="view view-reports">
      <div class="section-heading">
        <h2>Business intelligence</h2>
        <p>Insight snapshots across revenue, supply, and talent.</p>
      </div>

      <div class="card-grid">
        <article class="card">
          <h3>Weighted revenue forecast</h3>
          <strong>${formatCurrency(Math.round(forecast))}</strong>
          <span class="badge-pill">${state.sales.length} deals in motion</span>
        </article>
        <article class="card">
          <h3>Average tenure</h3>
          <strong>${averageTenureMonths} months</strong>
          <span class="badge-pill">${state.employees.length} employees tracked</span>
        </article>
        <article class="card">
          <h3>Open workstreams</h3>
          <strong>${openTasks.length}</strong>
          <span class="badge-pill">${state.tasks.length} total tasks</span>
        </article>
      </div>

      <div class="card-grid">
        <section>
          <h3>Sales by stage</h3>
          ${salesByStageMarkup}
        </section>
        <section>
          <h3>Headcount by department</h3>
          ${headcountMarkup}
        </section>
        <section>
          <h3>Inventory value by vendor</h3>
          ${vendorMarkup}
        </section>
      </div>

      <section>
        <h3>Task timeline</h3>
        <div class="list-grid">
          ${state.tasks
            .slice()
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .map(
              (task) => `
                <div class="list-item">
                  <div>
                    <strong>${task.name}</strong>
                    <span>${task.owner}</span>
                  </div>
                  <span class="status-chip ${task.status === 'Complete' ? 'success' : ''}">${task.status} · ${formatDate(
                task.dueDate
              )}</span>
                </div>
              `
            )
            .join('')}
        </div>
      </section>
    </section>
  `;
}

function groupBy(collection, selector) {
  return collection.reduce((map, item) => {
    const key = selector(item);
    if (!map[key]) {
      map[key] = [];
    }
    map[key].push(item);
    return map;
  }, {});
}

function calculateAverageTenure(employees) {
  if (!employees.length) return 0;
  const today = new Date();
  const totalMonths = employees.reduce((sum, employee) => {
    const start = new Date(employee.startDate);
    const months = (today.getFullYear() - start.getFullYear()) * 12 + (today.getMonth() - start.getMonth());
    return sum + Math.max(months, 0);
  }, 0);
  return Math.round(totalMonths / employees.length);
}

function renderTagListFromMap(map, formatter, emptyMessage) {
  const entries = Object.entries(map);
  if (!entries.length) {
    return `<p class="empty-state">${emptyMessage}</p>`;
  }
  return `<ul class="tag-list">${entries.map(formatter).join('')}</ul>`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2400);
}
