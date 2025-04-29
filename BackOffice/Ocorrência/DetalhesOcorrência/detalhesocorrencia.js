document.addEventListener('DOMContentLoaded', () => {
    // Get the occurrence ID from localStorage
    const occurrenceId = localStorage.getItem('selectedOccurrenceId');
    if (!occurrenceId) {
        console.error('No occurrence ID found');
        return;
    }

    // Get occurrences from localStorage
    const occurrences = JSON.parse(localStorage.getItem('ocorrencias')) || [];
    const occurrence = occurrences.find(o => o.id === parseInt(occurrenceId));

    if (!occurrence) {
        console.error('Occurrence not found');
        return;
    }

    // Populate the page with occurrence details
    document.querySelector('.tag-blue').textContent = occurrence.tipo;
    document.querySelector('.tag-green').textContent = occurrence.estado;
    document.getElementById('occurrenceDescription').textContent = occurrence.descricao;
    document.getElementById('reporterInfo').textContent = `${occurrence.userName || 'N/A'} (${occurrence.email || 'N/A'})`;
    document.getElementById('locationInfo').textContent = occurrence.location || 'N/A';
    document.getElementById('coordinates').textContent = 
        occurrence.coordinates ? `${occurrence.coordinates.latitude}, ${occurrence.coordinates.longitude}` : 'N/A';

    // Display images in the images grid
    const imagesGrid = document.getElementById('imagesGrid');
    if (imagesGrid && occurrence.imagens && occurrence.imagens.length > 0) {
        occurrence.imagens.forEach(imageBase64 => {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'image-container';
            
            const img = document.createElement('img');
            img.src = imageBase64; // Use Base64 data directly
            img.alt = 'Imagem da ocorrência';
            img.className = 'occurrence-image';
            
            // Add click handler to show image in full size
            img.addEventListener('click', () => {
                showImageFullsize(imageBase64);
            });
            
            imgContainer.appendChild(img);
            imagesGrid.appendChild(imgContainer);
        });
    } else if (imagesGrid) {
        imagesGrid.innerHTML = '<p class="no-images">Não foram anexadas imagens</p>';
    }

    // Initialize map
    if (occurrence.coordinates) {
        initMap(occurrence.coordinates.latitude, occurrence.coordinates.longitude);
    }

    // Handle approve/reject buttons
    document.querySelector('.button-green').addEventListener('click', () => {
        // Store the current occurrence ID for use in criarauditoria.html
        localStorage.setItem('occurrenceForAudit', occurrenceId);
        // Redirect to criarauditoria.html
        window.location.href = '../../Auditoria/criarauditoria.html';
    });

    document.querySelector('.button-red').addEventListener('click', () => {
        occurrence.estado = 'Não Aceite';
        updateOccurrenceStatus(occurrence);
    });
});



// Add this function for fullsize image viewing
function showImageFullsize(imageBase64) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <img src="${imageBase64}" alt="Imagem em tamanho completo">
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close-modal').onclick = () => {
        modal.remove();
    };
    
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    };
}

// Make initMap available globally
window.initMap = function() {
    try {
        const occurrenceId = localStorage.getItem('selectedOccurrenceId');
        const occurrences = JSON.parse(localStorage.getItem('ocorrencias')) || [];
        const occurrence = occurrences.find(o => o.id === parseInt(occurrenceId));

        if (!occurrence) {
            console.error('Occurrence not found');
            return;
        }

        const coordinates = {
            lat: parseFloat(occurrence.coordinates.latitude),
            lng: parseFloat(occurrence.coordinates.longitude)
        };

        const map = new google.maps.Map(document.getElementById("map"), {
            zoom: 15,
            center: coordinates,
        });

        new google.maps.Marker({
            position: coordinates,
            map: map,
            title: "Local da Ocorrência"
        });
    } catch (error) {
        console.error('Error initializing map:', error);
    }
}

// Add error handling
function handleMapError() {
    console.error('Google Maps failed to load');
    document.getElementById('map').innerHTML = 
        '<div style="padding: 1rem; text-align: center;">Error loading map</div>';
}

function initMap(lat, lng) {
    const coordinates = { lat: parseFloat(lat), lng: parseFloat(lng) };
    
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: coordinates,
    });

    // Add a marker
    new google.maps.Marker({
        position: coordinates,
        map: map,
        title: "Local da Ocorrência"
    });
}

function updateOccurrenceStatus(updatedOccurrence) {
    const occurrences = JSON.parse(localStorage.getItem('occurrencesData')) || [];
    const index = occurrences.findIndex(o => o.id === updatedOccurrence.id);
    if (index !== -1) {
        occurrences[index] = updatedOccurrence;
        localStorage.setItem('occurrencesData', JSON.stringify(occurrences));
        window.location.href = 'ocorrencia.html';
    }
}

// Add this function for fullsize image viewing
function showImageFullsize(imageBase64) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <img src="${imageBase64}" alt="Imagem em tamanho completo" class="fullsize-image">
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close-modal').onclick = () => {
        modal.remove();
    };
    
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    };
}