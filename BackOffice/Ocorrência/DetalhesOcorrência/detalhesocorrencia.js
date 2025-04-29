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
    document.getElementById('occurrenceDescription').textContent = occurrence.descricao;
    document.getElementById('reporterInfo').textContent = `(${occurrence.email || 'N/A'})`;
    document.getElementById('locationInfo').textContent = occurrence.morada || 'N/A';
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

    // Function to update status tag
function updateStatusTag(status) {
    const statusTag = document.querySelector('.tag-green');
    statusTag.textContent = status;
    
    // Remove existing status classes
    statusTag.classList.remove('status-aceite', 'status-espera', 'status-rejeitado');
    
    // Add appropriate class based on status
    switch(status) {
        case 'Aceite':
            statusTag.classList.add('status-aceite');
            break;
        case 'Em Espera':
            statusTag.classList.add('status-espera');
            break;
        case 'Não Aceite':
            statusTag.classList.add('status-rejeitado');
            break;
    }
}

// Atualizar o status inicial
const statusTag = document.querySelector('.tag-green');
if (statusTag) {
    statusTag.textContent = occurrence.estado || 'Em Espera';
    updateStatusTag(occurrence.estado || 'Em Espera');
}

// Atualizar o botão vermelho
document.querySelector('.button-red').addEventListener('click', () => {
    const occurrences = JSON.parse(localStorage.getItem('ocorrencias')) || [];
    const index = occurrences.findIndex(o => o.id === parseInt(occurrenceId));
    
    if (index !== -1) {
        occurrences[index].estado = 'Não Aceite';
        localStorage.setItem('ocorrencias', JSON.stringify(occurrences));
        
        // Atualizar a tag com a nova cor
        updateStatusTag('Não Aceite');
        
        setTimeout(() => {
            history.back();
        }, 500);
    }
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
            lat: parseFloat(occurrence.latitude),
            lng: parseFloat(occurrence.longitude)
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
});