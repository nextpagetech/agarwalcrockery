document.addEventListener("DOMContentLoaded",()=>{
  const reveals=[...document.querySelectorAll(".reveal")];
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("show");io.unobserve(e.target)}});
  },{threshold:.14});
  reveals.forEach(el=>io.observe(el));

  const categoryButtons=[...document.querySelectorAll("[data-filter]")];
  const cards=[...document.querySelectorAll("[data-product]")];
  const search=document.querySelector("#productSearch");
  const count=document.querySelector("#resultCount");

  function applyFilters(){
    const active=document.querySelector("[data-filter].active")?.dataset.filter || "all";
    const q=(search?.value||"").trim().toLowerCase();
    let visible=0;
    cards.forEach(card=>{
      const category=card.dataset.category;
      const text=card.dataset.product.toLowerCase();
      const show=(active==="all"||category===active)&&(!q||text.includes(q));
      card.closest(".product-wrap").classList.toggle("d-none",!show);
      if(show) visible++;
    });
    if(count) count.textContent=`${visible} products`;
  }

  categoryButtons.forEach(btn=>btn.addEventListener("click",()=>{
    categoryButtons.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    applyFilters();
  }));
  search?.addEventListener("input",applyFilters);

  document.querySelectorAll("[data-add]").forEach(btn=>btn.addEventListener("click",()=>{
    const original=btn.innerHTML;
    btn.innerHTML='<i class="bi bi-check2 me-1"></i> Added';
    btn.classList.remove("btn-dark"); btn.classList.add("btn-success");
    setTimeout(()=>{btn.innerHTML=original;btn.classList.remove("btn-success");btn.classList.add("btn-dark")},1400);
  }));
});
