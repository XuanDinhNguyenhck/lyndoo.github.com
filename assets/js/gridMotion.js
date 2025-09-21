// Vanilla GridMotion (GSAP-based)
// Usage: window.GridMotion.init({ container: document.getElementById('home'), items: window.GRID_ITEMS, gradientColor: '#000' })
(function(window){
  function isImageString(s){
    return typeof s === 'string' && s.startsWith('http');
  }

  function createGridElement(items, gradientColor){
    const wrapper = document.createElement('div');
    wrapper.className = 'noscroll gridmotion-intro';
    wrapper.style.pointerEvents = 'none';

    const section = document.createElement('section');
    section.className = 'intro';
    section.style.background = `radial-gradient(circle, ${gradientColor} 0%, transparent 100%)`;
    section.style.position = 'absolute';
    section.style.top = '0';
    section.style.left = '0';
    section.style.width = '100%';
    section.style.height = '100%';
    wrapper.appendChild(section);

    const container = document.createElement('div');
    container.className = 'gridMotion-container';

    const totalRows = 4;
    const perRow = 7;
    const totalItems = totalRows * perRow;
    const combined = (items && items.length) ? items.slice(0, totalItems) : Array.from({length: totalItems}, (_,i)=>`Item ${i+1}`);

    const rowEls = [];
    for(let r=0;r<totalRows;r++){
      const row = document.createElement('div');
      row.className = 'row';
      rowEls.push(row);
      for(let c=0;c<perRow;c++){
        const idx = r*perRow + c;
        const content = combined[idx];
        const item = document.createElement('div');
        item.className = 'row__item';
        const inner = document.createElement('div');
        inner.className = 'row__item-inner';
        if(isImageString(content)){
          const imgDiv = document.createElement('div');
          imgDiv.className = 'row__item-img';
          imgDiv.style.backgroundImage = `url(${content})`;
          inner.appendChild(imgDiv);
        } else {
          const contentDiv = document.createElement('div');
          contentDiv.className = 'row__item-content';
          contentDiv.innerHTML = (typeof content === 'string') ? content : (content && content.outerHTML ? content.outerHTML : '');
          inner.appendChild(contentDiv);
        }
        item.appendChild(inner);
        row.appendChild(item);
      }
      container.appendChild(row);
    }

    section.appendChild(container);
    const fullview = document.createElement('div');
    fullview.className = 'fullview';
    section.appendChild(fullview);

    return { wrapper, rowEls };
  }

  function GridMotion(){
    this._mounted = false;
    this._rows = [];
    this._removeTicker = null;
  }

  GridMotion.prototype.init = function(opts){
    if(this._mounted) return;
    if(!opts || !opts.container) throw new Error('container is required');
    const items = opts.items || window.GRID_ITEMS || [];
    const gradientColor = opts.gradientColor || window.GRID_GRADIENT || 'rgba(0,0,0,0.6)';

    const { wrapper, rowEls } = createGridElement(items, gradientColor);
    this._rows = rowEls;
    this._container = opts.container;
    this._container.style.position = 'relative';
    this._container.appendChild(wrapper);
    this._mounted = true;

    // mouse tracking
    const that = this;
    this._mouseX = window.innerWidth/2;
    function onMove(e){ that._mouseX = e.clientX; }
    window.addEventListener('mousemove', onMove);
    this._cleanupMouse = ()=> window.removeEventListener('mousemove', onMove);

    // gsap ticker motion
    gsap.ticker.lagSmoothing(0);
    const maxMoveAmount = 300;
    const baseDuration = 0.8;
    const inertiaFactors = [0.6, 0.4, 0.3, 0.2];

    function updateMotion(){
      that._rows.forEach((row, index)=>{
        const direction = index % 2 === 0 ? 1 : -1;
        const moveAmount = ((that._mouseX / window.innerWidth) * maxMoveAmount - maxMoveAmount/2) * direction;
        gsap.to(row, {
          x: moveAmount,
          duration: baseDuration + inertiaFactors[index % inertiaFactors.length],
          ease: 'power3.out',
          overwrite: 'auto'
        });
      });
    }
    this._removeTicker = gsap.ticker.add(updateMotion);
  };

  GridMotion.prototype.destroy = function(){
    if(!this._mounted) return;
    if(this._removeTicker) this._removeTicker();
    if(this._cleanupMouse) this._cleanupMouse();
    // remove wrapper
    const wrapper = this._container.querySelector('.gridmotion-intro');
    wrapper && wrapper.remove();
    this._mounted = false;
  };

  window.GridMotion = new GridMotion();

})(window);
