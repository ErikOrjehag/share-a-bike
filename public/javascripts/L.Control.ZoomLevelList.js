
/*

  This code is pretty general purpose and it would be cool to open source it.
  But It's not downloaded from the internet, I have written the code...
 - Erik Örjehag

 */


L.Control.ZoomLevelList = L.Control.Zoom.extend({
  options: {
    position: "topleft",
    zoomInText: "+",
    zoomInTitle: "Zoom in",
    zoomOutText: "-",
    zoomOutTitle: "Zoom out",
    showNumbers: true
  },

  onAdd: function (map) {
    var zoomName = 'zoom-level-list'
      , container = L.DomUtil.create('div', zoomName + ' leaflet-bar')
      , options = this.options
      , self = this;

    this._map = map;

    this._zoomInButton = this._createButton(options.zoomInText, options.zoomInTitle, zoomName + '-in', container, this._zoomIn, this);
    
    this._zoomLevelButtons = [];

    if (options.showNumbers) {

      var min = map.getMinZoom();
      var max = map.getMaxZoom();

      for (var i = max, k = max - min; i >= min; i--, k--) {
        this._zoomLevelButtons.push(
            this._createButton(
                k                                 // Text
                , 'Zoom ' + k                       // Title
                , zoomName + '-level-'+k            //
                , container                         //
                , (function (self, level) {         // Capture scope
                  return function () {            // Callback
                    self._zoomToLevel(level);     // Zoom to
                  };
                })(this, i)
                , this)
        );
      }
    }
    
    this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle, zoomName + '-out', container, this._zoomOut, this);
    
    this._updateDisabled();

    map.on('zoomend zoomlevelschange', this._updateDisabled, this);

    return container;
  },

  _zoomToLevel: function (level) {
    this._map.setZoom(level);
  },

  _updateDisabled: function () {
    var map = this._map;
    var className = 'leaflet-disabled';
    var min = map.getMinZoom();
    var max = map.getMaxZoom();
    var zoom = map._zoom;

    // The map.flyTo function sets zoom level with decemals.
    // We only need to update the zoom list when we hit even numbers.
    // This helps performance.
    if (zoom % 1 !== 0) {
      return;
    }

    L.DomUtil.removeClass(this._zoomInButton, className);
    L.DomUtil.removeClass(this._zoomOutButton, className);

    for (var i = 0; i < this._zoomLevelButtons.length; i++) {
      L.DomUtil.removeClass(this._zoomLevelButtons[i], className);
    }

    if (zoom === min) {
      L.DomUtil.addClass(this._zoomOutButton, className)
    }

    if (zoom === max) {
      L.DomUtil.addClass(this._zoomInButton, className)
    }

    if (this._zoomLevelButtons.length) {
      L.DomUtil.addClass(this._zoomLevelButtons[max - zoom], className);
    }
  }
});