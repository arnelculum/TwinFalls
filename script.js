document.addEventListener('DOMContentLoaded', function() {
  // Load data and create interactive polygons
  fetch('data.json')
      .then(response => response.json())
      .then(data => {
          data.forEach(location => {
              // Create SVG polygon for each location
              var polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
              polygon.setAttribute("points", location.coordinates.map(c => `${c.x},${c.y}`).join(" "));
              polygon.style.fill = "rgba(255, 0, 0, 0.5)";
              polygon.style.stroke = "red";
              polygon.style.strokeWidth = "2";

              // Event listener for polygon
              polygon.addEventListener('click', () => {
                  // Clear existing popup content and create popup
                  createPopup(location);
              });

              document.getElementById('svgOverlay').appendChild(polygon);
          });
      })
      .catch(error => console.error('Error fetching data:', error));

  // Function to create and show the popup
  function createPopup(location) {
      var popup = document.getElementById('popup');
      popup.innerHTML = '';

      // Add images to the popup
      location.images.forEach(imageSrc => {
          var img = document.createElement('img');
          img.src = imageSrc;
          img.classList.add('popupImage');
          popup.appendChild(img);
      });

      // Add Close button to the popup
      var closeButton = document.createElement('button');
      closeButton.textContent = 'Close';
      closeButton.id = 'closePopup';
      closeButton.addEventListener('click', function() {
          popup.classList.add('hidden');
      });
      popup.appendChild(closeButton);

      // Show the popup
      popup.classList.remove('hidden');
  }

  // Coordinate capturing functionality
  var coordinateDisplay = document.getElementById('coordinateDisplay');
  var svgOverlay = document.getElementById('svgOverlay');
  var clickPoints = [];
  var maxPoints = 4;

  svgOverlay.addEventListener('click', function(event) {
      if (event.target.tagName === 'svg' && clickPoints.length < maxPoints) {
          var rect = svgOverlay.getBoundingClientRect();
          var x = event.clientX - rect.left;
          var y = event.clientY - rect.top;
          clickPoints.push({ x: x, y: y });
          coordinateDisplay.innerHTML += 'Point ' + clickPoints.length + ': (' + x + ', ' + y + ')<br>';

          if (clickPoints.length === maxPoints) {
              coordinateDisplay.innerHTML += 'All points recorded: ' + JSON.stringify(clickPoints) + '<br>';
          }
      }
  });

  // Reset coordinates functionality
  var resetButton = document.getElementById('resetCoordinates');
  resetButton.addEventListener('click', function() {
      clickPoints = [];
      coordinateDisplay.innerHTML = '';
  });
});
