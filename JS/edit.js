// EDIT MODAL (Seadrah)

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the edit button
    const editButton = document.getElementById('editButton');
   
    console.log(editButton);
    console.log(editButton + "working");
   
    // Get or create modal overlay
    let modalOverlay = document.getElementById('modalOverlay');
   
    // If modal doesn't exist, create it and move the form inside
    if (!modalOverlay) {
        createModalWrapper();
        modalOverlay = document.getElementById('modalOverlay');
    }
   
    // Add click event to edit button
    if (editButton) {
        editButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openModal();
        });
    }
   
    // Close modal when clicking the X button
    const closeButton = document.querySelector('.modal-close');
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
   
    // Close modal when clicking outside the modal container
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }
   
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
   
  // --- Form Submission ---
    const eventForm = document.getElementById('event_form');


    if (eventForm) {
     eventForm.addEventListener('submit', function(e) {
         e.preventDefault();

         // --- Title ---
         const titleInput = document.getElementById('event_title_input');
         const titleEl = document.getElementById('event_title');
         if (titleInput && titleEl && titleInput.value.trim() !== '') {
             titleEl.innerHTML = titleInput.value.trim();
         }

        // --- Logo ---
         const logoImgInput = document.getElementById('event_logo_input');
         const logoTarget = document.getElementById('event_logo');
         if (
             logoImgInput &&
             logoTarget &&
             logoImgInput.dataset.changed === "true" &&
             logoImgInput.src &&
             logoImgInput.src !== '../image/placeholder_logo.png'
         ) {
             logoTarget.src = logoImgInput.src;
         }

         console.log('Form submitted (only non-empty fields and changed logo updated).');
         closeModal();
    });
}

});  // <-- added to properly close the first DOMContentLoaded listener



function createModalWrapper() {
    // Get the existing form container
    const eventInfoInput = document.getElementById('event_form');
    const pageTitle = document.getElementById('page_title');
   
    if (!eventInfoInput) {
        console.error('Event info input not found');
        return;
    }
   
    // Hide the page title when in modal mode
    if (pageTitle) {
        pageTitle.style.display = 'none';
    }
   
    // Create modal structure
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'modalOverlay';
    modalOverlay.className = 'modal-overlay';
   
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
   
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    modalHeader.innerHTML = `
        <h2>Edit Event</h2>
        <button class="modal-close" aria-label="Close modal">&times;</button>
    `;
   
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
   
    // Move the existing form into the modal body
    modalBody.appendChild(eventInfoInput);
   
    // Assemble modal
    modalContainer.appendChild(modalHeader);
    modalContainer.appendChild(modalBody);
    modalOverlay.appendChild(modalContainer);
   
    // Add modal to body
    document.body.appendChild(modalOverlay);
   
    // Set up close button
    const closeButton = modalHeader.querySelector('.modal-close');
    closeButton.addEventListener('click', closeModal);

    // Add placeholder values
    document.getElementById('event_title_input').placeholder = document.getElementById('event_title').innerHTML;

}

// small func to remove extra spaces
function removeExtraSpaces(s) { return s.replace(/\s+/g, ' ').trim(); }

function openModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
        modalOverlay.classList.add('active');
        document.body.classList.add('modal-open');
    }
}

function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
}

function initializeSectionManagement() {
    // Wait for modal to be created
    setTimeout(() => {
        setupAddSectionButtons();
    }, 100);
}

function setupAddSectionButtons() {
    const eventForm = document.getElementById('event_form');
    if (!eventForm) return;
   
    // Find all "Add Section" and "Add Related Events" cards
    const addCards = eventForm.querySelectorAll('.cardWinner_edit');
   
    addCards.forEach(card => {
        const heading = card.querySelector('h3');
        if (heading && (heading.textContent.includes('+ Add Section') || heading.textContent.includes('+ Add Related Events'))) {
            // Add class for styling
            card.classList.add('add-new');
           
            // Update HTML to include plus icon
            const isSection = heading.textContent.includes('Section');
            heading.innerHTML = `<span class="plus-icon">+</span> Add ${isSection ? 'Section' : 'Related Event'}`;
           
            // Add click handler
            card.addEventListener('click', function(e) {
                e.preventDefault();
                addNewSection(card, isSection);
            });
        }
    });
}

function addNewSection(addButton, isSection) {
    const container = addButton.parentElement;
    const sectionName = prompt(`Enter ${isSection ? 'section' : 'related event'} name:`);

    if (!sectionName || !sectionName.trim()) return;
    const name = sectionName.trim();

    // --- Handle Related Events ---
    if (!isSection) {
        // Find or create the flexbox container
        let relatedContainer = container.querySelector('.related-events-container');
        if (!relatedContainer) {
            relatedContainer = document.createElement('div');
            relatedContainer.className = 'related-events-container';
           
            // Move "+ Add Related Event" card inside this flex container
            container.appendChild(relatedContainer);
            relatedContainer.appendChild(addButton);
        }

        // Create new related event tile
        const newTile = document.createElement('div');
        newTile.className = 'related-event-tile';
        newTile.innerHTML = `
            <h3 contenteditable="true">${name}</h3>
            <span class="delete-btn" title="Delete">×</span>
        `;

        // Insert new tile before "+ Add Related Event" button
        relatedContainer.insertBefore(newTile, addButton);

        // Delete button logic
        const deleteBtn = newTile.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (confirm(`Delete "${name}"?`)) {
                newTile.remove();
            }
        });

        // Handle editing
        const heading = newTile.querySelector('h3');
        heading.addEventListener('blur', function () {
            if (this.textContent.trim() === '') {
                this.textContent = name;
            }
        });

        heading.focus();
        return;
    }

    // --- Handle Normal Sections ---
    const newCard = document.createElement('section');
    newCard.className = 'cardWinner section-item';
    newCard.innerHTML = `
        <h3 contenteditable="true">${name}</h3>
        <span class="delete-btn" title="Delete">×</span>
    `;
    container.insertBefore(newCard, addButton);

    const deleteBtn = newCard.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (confirm(`Delete "${name}"?`)) {
            newCard.remove();
        }
    });

    const heading = newCard.querySelector('h3');
    heading.addEventListener('blur', function() {
        if (this.textContent.trim() === '') {
            this.textContent = name;
        }
    });

    heading.focus();
}

// --- Logo Upload Handling ---
document.addEventListener("DOMContentLoaded", function() {
    const logoImg = document.getElementById("event_logo_input");
    const logoUpload = document.getElementById("logo_upload_input");

    if (logoImg && logoUpload) {
        // Track whether a new logo was uploaded
        logoImg.dataset.changed = "false";

        // When user clicks the logo image, open file selector
        logoImg.addEventListener("click", function() {
            logoUpload.click();
        });

        // When user selects a new image
        logoUpload.addEventListener("change", function(event) {
            const file = event.target.files[0];
            if (file && file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    logoImg.src = e.target.result; // show preview
                    logoImg.dataset.changed = "true"; // mark as changed
                };
                reader.readAsDataURL(file);
            } else if (file) {
                alert("Please select a valid image file.");
            }
        });

    }
});

// --- Modal Setup ---
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    const editButton = document.getElementById('editButton');
    if (editButton) {
      editButton.addEventListener('click', setupEditModalFeaturedSection);
    }
  }, 100);
});

function setupEditModalFeaturedSection() {
  const featuredSection = document.querySelector('.dbwinnertable_edit');
  if (!featuredSection) {
    console.warn('Edit section not found');
    return;
  }

  if (document.getElementById('featured_events_input_section')) {
    updateFeaturedList();
    return;
  }

  updateFeaturedList();
  setupFeaturedAutocomplete();

  const addBtn = document.getElementById('add_featured_btn');
  if (addBtn) {
    addBtn.addEventListener('click', function() {
      const input = document.getElementById('featured_event_input');
      if (input && input.value.trim()) {
        addFeaturedEventByTitle(input.value.trim());
        input.value = '';
        const suggestions = document.getElementById('featured_suggestions');
        if (suggestions) suggestions.classList.remove('active');
      }
    });
  }
}

function setupFeaturedAutocomplete() {
  const input = document.getElementById('featured_event_input');
  const suggestionsContainer = document.getElementById('featured_suggestions');
  if (!input || !suggestionsContainer) return;

  input.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase().trim();
    suggestionsContainer.innerHTML = '';

    if (searchTerm.length === 0) {
      suggestionsContainer.classList.remove('active');
      return;
    }

    const filteredEvents = allEventsData
      .filter(event => event.title.toLowerCase().includes(searchTerm) || event.cleanTitle.toLowerCase().includes(searchTerm))
      .slice(0, 10);

    if (filteredEvents.length > 0) {
      suggestionsContainer.classList.add('active');
      filteredEvents.forEach(function(event, index) {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('featured-suggestion-item');
        if (index === 0) suggestionItem.setAttribute('data-first', 'true');

        suggestionItem.innerHTML = `<strong>${event.cleanTitle}</strong><small>${event.location} • ${event.year}</small>`;
        suggestionItem.addEventListener('click', function() {
          addFeaturedEventById(event.id);
          input.value = '';
          suggestionsContainer.classList.remove('active');
        });

        suggestionsContainer.appendChild(suggestionItem);
      });
    } else {
      suggestionsContainer.classList.remove('active');
    }
  });

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const firstSuggestion = suggestionsContainer.querySelector('.featured-suggestion-item[data-first="true"]');
      if (firstSuggestion) {
        firstSuggestion.click();
      } else {
        const addBtn = document.getElementById('add_featured_btn');
        if (addBtn) addBtn.click();
      }
    }
  });

  document.addEventListener('click', function(event) {
    if (!input.contains(event.target) && !suggestionsContainer.contains(event.target)) {
      suggestionsContainer.classList.remove('active');
    }
  });
}

function addFeaturedEventById(eventId) {
  if (!csvDataLoaded || allEventsData.length === 0) {
    alert('Event data is still loading. Please wait a moment and try again.');
    return;
  }

  const event = allEventsData.find(e => e.id === eventId);
  if (!event) return alert('Event not found in database.');

  if (featuredEventsData.some(fe => fe.id === event.id)) {
    alert(event.cleanTitle + ' is already featured.');
    return;
  }

  featuredEventsData.push(event);
  saveFeaturedEvents();
  updateFeaturedList();
  renderFeaturedEvents();
  alert('✓ Added "' + event.cleanTitle + '" to featured events!');
}

function addFeaturedEventByTitle(eventTitle) {
  const trimmedTitle = eventTitle.trim();
  if (!trimmedTitle) return alert('Please enter an event name');

  if (!csvDataLoaded || allEventsData.length === 0) {
    alert('Event data is still loading. Please wait a moment and try again.');
    return;
  }

  const event = allEventsData.find(e =>
    e.title.toLowerCase().includes(trimmedTitle.toLowerCase()) ||
    e.cleanTitle.toLowerCase().includes(trimmedTitle.toLowerCase())
  );

  if (!event) {
    alert('Event not found in database.\nSearched for: "' + trimmedTitle + '"\n\nTip: Try searching for partial names like "Texas State" or "USDGC"');
    return;
  }

  if (featuredEventsData.some(fe => fe.id === event.id)) {
    alert(event.cleanTitle + ' is already featured.');
    return;
  }

  featuredEventsData.push(event);
  saveFeaturedEvents();
  updateFeaturedList();
  renderFeaturedEvents();
  alert('✓ Added "' + event.cleanTitle + '" to featured events!');
}

function removeFeaturedEvent(eventId) {
  featuredEventsData = featuredEventsData.filter(e => e.id !== eventId);
  saveFeaturedEvents();
  renderFeaturedEvents();
}

function updateFeaturedList() {
  const listContainer = document.getElementById('featured_list_items');
  if (!listContainer) return;

//   if (featuredEventsData.length === 0) {
//     listContainer.innerHTML = '<li style="color: #999; padding: 0.5rem;">No featured events yet</li>';
//     return;
//   }

  listContainer.innerHTML = '';
 
  var childDivs = document.getElementsByClassName("featured-scroll-container")[0].getElementsByTagName('div');


    for( i=0; i< childDivs.length; i++ )
    {
        var childDiv = childDivs[i];
        let divTitle = childDiv.children[0].innerHTML;
        let divYear = childDiv.children[1].innerHTML;
        let divPurse = childDiv.children[2].innerHTML;
       
        const li = document.createElement('li');
        li.style.cssText = 'padding: 0.75rem; background: white; margin-bottom: 0.5rem; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #ddd;';
       
        const infoDiv = document.createElement('div');
        infoDiv.innerHTML = `<strong>${divTitle}</strong><div style="font-size:0.85rem;color:#666;margin-top:0.25rem;">${divYear}</div>`;
       
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.textContent = 'Remove';
        removeBtn.style.cssText = 'background:#e74c3c;color:white;border:none;padding:0.4rem 0.8rem;border-radius:4px;cursor:pointer;font-size:0.9rem;';
        removeBtn.onclick = function() { removeFeaturedEventFromModal(event.id); };
   
        li.appendChild(infoDiv);
        li.appendChild(removeBtn);
        listContainer.appendChild(li);
    }
   
  featuredEventsData.forEach(function(event) {
    const li = document.createElement('li');
   
    li.style.cssText = 'padding: 0.75rem; background: white; margin-bottom: 0.5rem; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #ddd;';

    const infoDiv = document.createElement('div');
    infoDiv.innerHTML = `<strong>${event.cleanTitle}</strong><div style="font-size:0.85rem;color:#666;margin-top:0.25rem;">${event.location}</div>`;

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.textContent = 'Remove';
    removeBtn.style.cssText = 'background:#e74c3c;color:white;border:none;padding:0.4rem 0.8rem;border-radius:4px;cursor:pointer;font-size:0.9rem;';
    removeBtn.onclick = function() { removeFeaturedEventFromModal(event.id); };

    li.appendChild(infoDiv);
    li.appendChild(removeBtn);
    listContainer.appendChild(li);
  });
}

function removeFeaturedEventFromModal(eventId) {
  featuredEventsData = featuredEventsData.filter(e => e.id !== eventId);
  saveFeaturedEvents();
  updateFeaturedList();
  renderFeaturedEvents();
}

document.addEventListener("DOMContentLoaded", () => {
    const editBtn = document.getElementById("editButton");
    const modal = document.getElementById("modalOverlay");
    const closeBtn = document.querySelector(".modal-close");

    if (!editBtn || !modal || !closeBtn) {
        console.error("Modal elements missing");
        return;
    }

    editBtn.addEventListener("click", () => {
        modal.classList.add("active");
        document.body.classList.add("modal-open");
    });

    closeBtn.addEventListener("click", () => {
        modal.classList.remove("active");
        document.body.classList.remove("modal-open");
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("active");
            document.body.classList.remove("modal-open");
        }
    });
});