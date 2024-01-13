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
          createPopup(location);
        });

        document.getElementById('svgOverlay').appendChild(polygon);
      });

      // Menu Icon click event
      var menuIcon = document.getElementById('menuIcon');
      if (menuIcon) {
        menuIcon.addEventListener('click', function() {
          var menuContent = document.getElementById('menuContent');
          if (menuContent) {
            // Toggle the 'show' class to display or hide the menu
            menuContent.classList.toggle('show');
          }
        });
      }
    })
    .catch(error => console.error('Error fetching data:', error));

  function createPopup(location) {
    var popup = document.getElementById('popup');
    popup.innerHTML = '';

    var header = document.createElement('div');
    header.id = 'popupHeader';
    var title = document.createElement('h2');
    title.id = 'popupTitle';
    title.textContent = location.address;
    header.appendChild(title);
    
    var closeButton = document.createElement('span');
    closeButton.id = 'closePopup';
    closeButton.textContent = '✕';
    closeButton.onclick = function() {
      popup.classList.add('hidden');
    };
    header.appendChild(closeButton);
    
    popup.appendChild(header);

    var grid = document.createElement('div');
    grid.id = "grid";
    grid.className = "grid-container";
    popup.appendChild(grid);

    location.images.forEach(imageSrc => {
      var img = document.createElement('img');
      img.src = imageSrc;
      img.alt = "Image for " + location.address;
      img.className = "grid-item";
      img.onclick = function() {
        openModal(imageSrc);
      };
      grid.appendChild(img);
    });

    var form = document.createElement('form');
    form.className = 'image-upload-form';
    var formTitle = document.createElement('p');
    formTitle.textContent = 'Do you have an old image? Submit it here:';
    form.appendChild(formTitle);

    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.className = 'file-input';
    form.appendChild(fileInput);

    var submitButton = document.createElement('button');
    submitButton.type = 'button';
    submitButton.textContent = 'Upload';
    submitButton.className = 'submit-button';
    form.appendChild(submitButton);

    popup.appendChild(form);

    popup.classList.remove('hidden');
  }

  function openModal(imageSrc) {
    var modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.onclick = function() {
      modalOverlay.style.display = 'none';
    };

    var modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.onclick = function(e) {
      e.stopPropagation(); // Prevents the modal from closing when clicking inside the content
    };

    var fullSizeImg = document.createElement('img');
    fullSizeImg.src = imageSrc;
    fullSizeImg.className = 'full-size-image';
    
    modalContent.appendChild(fullSizeImg);
    modalOverlay.appendChild(modalContent);

    document.body.appendChild(modalOverlay);
    modalOverlay.style.display = 'flex';
  }

  // Coordinate capturing functionality
  var svgOverlay = document.getElementById('svgOverlay');
  var coordinateDisplay = document.getElementById('coordinateDisplay');
  var clickPoints = [];
  var maxPoints = 4;

  svgOverlay.addEventListener('click', function(event) {
    if (clickPoints.length >= maxPoints) return;

    var rect = svgOverlay.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    clickPoints.push({ x: x, y: y });
    coordinateDisplay.innerHTML += 'Point ' + clickPoints.length + ': (' + x + ', ' + y + ')<br>';

    if (clickPoints.length === maxPoints) {
      coordinateDisplay.innerHTML += 'All points recorded: ' + JSON.stringify(clickPoints) + '<br>';
    }
  });
});