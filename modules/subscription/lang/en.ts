const en = {
  // -- Page --
  pageTitle: 'Subscriptions',
  pageDescription: 'Manage and track all your recurring payments.',
  addSubscription: 'Add Subscription',

  // -- Dialog --
  editSubscription: 'Edit subscription',
  createSubscription: 'Create subscription',
  editSubscriptionDesc: 'Update subscription details',
  createSubscriptionDesc: 'Add a new subscription',

  // -- Form labels --
  name: 'Name',
  namePlaceholder: 'Netflix, Spotify...',
  category: 'Category',
  selectCategory: 'Select category',
  description: 'Description',
  descriptionPlaceholder: 'Optional description...',
  currency: 'Currency',
  selectCurrency: 'Select currency',
  price: 'Price',
  billingCycle: 'Billing Cycle',
  selectCycle: 'Select cycle',
  status: 'Status',
  selectStatus: 'Select status',
  nextBillingDate: 'Next billing date',

  // -- Categories --
  categoryStreaming: 'Streaming',
  categorySoftware: 'Software',
  categoryHosting: 'Hosting',
  categoryGym: 'Gym',
  categoryOther: 'Other',

  // -- Table headers --
  thName: 'Name',
  thPrice: 'Price',
  thCycle: 'Cycle',
  thStatus: 'Status',
  thNextBilling: 'Next Billing',
  noSubscriptions: 'No subscriptions found. Add your first one!',
  failedToLoadSubscriptions: 'Failed to load subscriptions. Please try again.',

  // -- Delete --
  deleteSubscription: 'Delete subscription',
  deleteSubscriptionConfirm: 'Are you sure you want to delete',
  deleteSubscriptionWarning: '? This action cannot be undone.',

  // -- Budget --
  totalCommitted: 'Total Committed',
  fixedMonthlyExpenses: 'Fixed monthly expenses',
  upcomingBills: 'Upcoming Bills',
  duePeriod: 'Due this period',
  totalMonthly: 'Total Monthly',
  allSubscriptions: 'All subscriptions',
  categories: 'Categories',
  activeCategories: 'Active categories',
  monthlyBudget: 'Monthly Budget',
  noDataAvailable: 'No data available',

  // -- Optional label --
  optional: 'optional',
};

export type SubscriptionDictionary = typeof en;
export default en;
