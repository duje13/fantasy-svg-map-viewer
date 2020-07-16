const ALL_MAP_LAYERS_SELECTOR = ".inclusive,.exclusive";

class FantasySvgMapViewer {

  //=========================================================
  //==================== CONSTRUCTOR ========================
  //=========================================================
  constructor(cssSelector, svgElement) {

    this._setMapcontainer(cssSelector); //this.mapSelector
    this._createMap(svgElement); //this.map, this.mapContainerWidth, this.mapContainerHeight
    this._setZoom(); //this._zoom
    this._calculateMapBBox(); //this.mapBBox

    this.moveTo(this.mapBBox, 0);

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
    this.addToolBoxItem("fas fa-arrows-alt", this.moveTo.bind(this, this.mapBBox));
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
      .attr("id", "map-menu")
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
    this.map.attr("height", "100%");

    var mapRect = this.map.node().getBoundingClientRect();
    this.mapContainerWidth = mapRect.width;
    this.mapContainerHeight = mapRect.height;
  }

  /**
   * Enable zoom and pan to map
   */
  _setZoom() {
    this._zoom = d3.zoom().on("zoom", () => {
      var transform = d3.event.transform;
      this.map.selectAll(ALL_MAP_LAYERS_SELECTOR).attr("transform", transform)
    });

    this.map.call(this._zoom);
  }

  moveTo(bbox, duration = 750) {
    var x0 = bbox.x;
    var y0 = bbox.y;
    var x1 = x0 + bbox.width;
    var y1 = y0 + bbox.height;

    this.map.transition().duration(duration).call(
      this._zoom.transform,
      d3.zoomIdentity
        .translate(this.mapContainerWidth / 2, this.mapContainerHeight / 2)
        .scale(
          Math.min(8, 0.9 / Math.max((x1 - x0) / this.mapContainerWidth, (y1 - y0) / this.mapContainerHeight)))
        .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
    );
  }

  _calculateMapBBox() {
    var bbox = {};
    bbox.width = -1;
    bbox.height = -1;
    bbox.x = 9999999999;
    bbox.y = 9999999999;

    this.map.selectAll(ALL_MAP_LAYERS_SELECTOR).each(function (d, i) {
      var thisBBox = this.getBBox();

      if(thisBBox.width > bbox.width) bbox.width = thisBBox.width;
      if(thisBBox.height > bbox.height) bbox.height = thisBBox.height;
      if(thisBBox.x < bbox.x) bbox.x = thisBBox.x;
      if(thisBBox.y < bbox.y) bbox.y = thisBBox.y;
    });

    this.mapBBox = bbox;
  }
}