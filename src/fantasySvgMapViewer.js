class FantasySvgMapViewer {
    
    //=========================================================
    //==================== CONSTRUCTOR ========================
    //=========================================================
    constructor(cssSelector, svgElement) {

      this._setMapcontainer(cssSelector); //this.mapSelector
      this._createMap(svgElement); //this.map
      this._setZoom(); //this._zoom
      
      //==================== UI ========================

      //Menu
      this._createMenu();
      this._buildInfoContent();
      this._buildSearchContent();
      this._buildMarkersContent();
      this._buildOptionsContent();

      //Toolbox
      this._createToolBox();
      this.addToolBoxItem("fas fa-info", this.switchMenuContent.bind(this, "#map-menu-content-info"));
      this.addToolBoxItem("fas fa-binoculars", this.switchMenuContent.bind(this, "#map-menu-content-search"));
      this.addToolBoxItem("fas fa-map-marker-alt", this.switchMenuContent.bind(this, "#map-menu-content-markers"));
      this.addToolBoxItem("fas fa-cogs", this.switchMenuContent.bind(this, "#map-menu-content-options"));
      this.addToolBoxItem("fas fa-arrows-alt");
    }

    //=========================================================
    //==================== UI =================================
    //=========================================================
    
    /**
     * Creates toolbox div
     */
    _createToolBox() {
      d3.select(this.mapSelector)
        .append("div")
        .attr("id", "map-toolbox")
    }

    /**
     * 
     * @param {string} icon fontawesome class name
     * @param {function} onClick
     */
    addToolBoxItem(icon, onClick) {
      d3.select(this.mapSelector)
        .select("#map-toolbox")
        .append("i")
        .attr("class", icon + " " + "map-toolbox-item")
        .on("click", onClick);
    }

    /**
     * Creates menu
     */
    _createMenu() {
      d3.select(this.mapSelector)
        .append("div")
        .attr("id","map-menu")
        .append("i")
        .attr("class", "fas fa-times")
        .attr("id", "map-menu-clsbtn")
        .on("click", () => {
          this.closeMenu();
        });
    }

    /**
     * Opens menu
     */
    openMenu() {
      d3.select("#map-menu")
        .style("width", "40%");
    }

    /**
     * Closes menu
     */
    closeMenu() {
      d3.select("#map-menu")
        .style("width", "0");
    }

    /**
     * 
     * @param {string} selector selector of div to show in menu previously made with createMenuContent()
     */
    switchMenuContent(selector) {
      d3.selectAll(".map-menu-content")
        .style("display", "none");
      d3.select(selector)
        .style("display", "block")
      
      this.openMenu();
    }

    /**
     * Creates div for menu content
     * 
     * @return {d3-object} created div. Append your content to it
     */
    createMenuContent() {
      return d3.select("#map-menu")
               .append("div")
               .attr("class", "map-menu-content");
    }

    /**
     * Create div for info button
     */
    _buildInfoContent() {
      this.createMenuContent()
          .attr("id", "map-menu-content-info")
          .text("Info")
    }

    /**
     * Create div for search button
     */
    _buildSearchContent() {
      this.createMenuContent()
          .attr("id", "map-menu-content-search")
          .text("Search")
    }

    /**
     * Create div for markers button
     */
    _buildMarkersContent() {
      this.createMenuContent()
          .attr("id", "map-menu-content-markers")
          .text("Markers")
    }

    /**
     * Create div for options button
     */
    _buildOptionsContent() {
      this.createMenuContent()
          .attr("id", "map-menu-content-options")
          .text("Options")
    }

    //=========================================================
    //============= MAP FUNCTIONS =============================
    //=========================================================

    /**
     * Set attributes of given DOM element and sets this.mapSelector
     * 
     * @param {string} cssSelector element where map will be appended
     */
    _setMapcontainer(cssSelector) {
      this.mapSelector = cssSelector;
      d3.select(this.mapSelector).style("position", "relative");
    }
    
    /**
     * Append map in DOM
     * 
     * @param {object} svgElement map
     */
    _createMap(svgElement) {
      d3.select(this.mapSelector).node().append(svgElement)
      this.map = d3.select(this.mapSelector).select("svg");
      this.map.attr("width", "100%");
      this.map.attr("height","100%");
    }

    /**
     * Enable zoom and pan to map
     */
    _setZoom() {
      this._zoom = d3.zoom().on("zoom", () => {
        var transform = d3.event.transform;
        this.map.selectAll(".inclusive,.exclusive").attr("transform", transform)
      });

      this.map.call(this._zoom);
    }
}