/* Agarwal Crockery House — shared category taxonomy, used by the header mega menu,
   shop filters, homepage category grid and footer links. */
(function (global) {
  global.AC_CATEGORIES = [
    {
      id: 'kitchen-equipment', label: 'Commercial Kitchen Equipments',
      subs: [
        { id: 'catering-equipments', label: 'Catering Equipments' },
        { id: 'dish-wash-equipments', label: 'Dish Wash Area Equipments' },
        { id: 'cooking-utensils', label: 'Cooking Utensils' },
        { id: 'preparation', label: 'Preparation' },
        { id: 'service-display-counter', label: 'Service and Display Counter' },
        { id: 'trolleys-racks-furniture', label: 'Trolleys-Racks-Furniture' },
        { id: 'wash-area', label: 'Wash Area' }
      ]
    },
    { id: 'bain-marie', label: 'Bain Marie', subs: [] },
    { id: 'commercial-oven', label: 'Commercial Oven', subs: [] },
    { id: 'commercial-mixer', label: 'Commercial Mixer', subs: [] },
    { id: 'dustbins', label: 'Dustbins', subs: [] },
    { id: 'tableware', label: 'Tableware', subs: [] },
    { id: 'service-products', label: 'Service Related Products', subs: [] },
    { id: 'crockery', label: 'Crockery', subs: [] },
    { id: 'bar-items', label: 'Bar Items', subs: [] },
    { id: 'cutlery', label: 'Cutlery', subs: [] },
    { id: 'glassware', label: 'Glassware', subs: [] },
    { id: 'waffle-cone-maker', label: 'Waffle & Cone Maker', subs: [] }
  ];

  global.AC_CATEGORY_LABELS = {};
  global.AC_CATEGORIES.forEach(function (c) {
    global.AC_CATEGORY_LABELS[c.id] = c.label;
    c.subs.forEach(function (s) { global.AC_CATEGORY_LABELS[s.id] = s.label; });
  });
})(window);
