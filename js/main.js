// --- CONFIGURATION ---
// 구글 앱스 스크립트(Google Apps Script) 웹 앱 배포 URL을 아래에 입력하세요.
const GOOGLE_SHEETS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwOaYEhuHoVFDkRNZYZhlgBbfk4jwxWWsgIf2Ozqd0bByroS8TcMSMdGd4n98eQIYSAhA/exec'; 

document.addEventListener('DOMContentLoaded', () => {
  // --- Navigation Smooth Scroll & Spy ---
  const navTabs = document.querySelectorAll('.nav-tab');
  const sections = document.querySelectorAll('.section');
  const stickyNav = document.getElementById('stickyNav');

  // Handle manual tab clicks
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        // Remove active class from all tabs
        navTabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');

        // Scroll to target section
        targetSection.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Scroll Spy using IntersectionObserver
  const spyOptions = {
    root: null,
    rootMargin: '-120px 0px -60% 0px', // Accounts for sticky header/nav height
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        navTabs.forEach(tab => {
          if (tab.getAttribute('data-target') === id) {
            tab.classList.add('active');
            // Ensure the active tab is visible in horizontally scrolling nav on mobile
            // We scroll ONLY the nav container, NOT the window.
            if (stickyNav) {
              const tabOffsetLeft = tab.offsetLeft;
              const tabWidth = tab.offsetWidth;
              const containerWidth = stickyNav.offsetWidth;
              stickyNav.scrollTo({
                left: tabOffsetLeft - (containerWidth / 2) + (tabWidth / 2),
                behavior: 'smooth'
              });
            }
          } else {
            tab.classList.remove('active');
          }
        });
      }
    });
  }, spyOptions);

  sections.forEach(section => observer.observe(section));


  // --- Lightbox Image Zoom ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const galleryItems = document.querySelectorAll('.gallery-item img');

  galleryItems.forEach(img => {
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      const src = img.getAttribute('src');
      const alt = img.getAttribute('alt');
      
      lightboxImg.setAttribute('src', src);
      lightboxCaption.textContent = alt;
      
      // Open Lightbox
      lightbox.classList.add('show');
      document.body.style.overflow = 'hidden'; // Disable page scrolling
    });
  });

  // Close lightbox
  const closeLightbox = () => {
    lightbox.classList.remove('show');
    document.body.style.overflow = ''; // Enable page scrolling
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', closeLightbox);
  
  // Close lightbox on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('show')) {
      closeLightbox();
    }
  });


  // --- Asset Protection (Right Click & Drag Blocking) ---
  // Blocks right-click context menu (especially on images)
  document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG' || e.target.closest('.gallery-item')) {
      e.preventDefault();
      showProtectionToast('이미지 무단 복제 및 불펌을 금지합니다.');
    }
  });

  // Blocks image dragging
  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
    }
  });

  // Optional: Dynamic protection toast instead of ugly native alert
  function showProtectionToast(message) {
    // Check if toast already exists
    let toast = document.getElementById('protection-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'protection-toast';
      Object.assign(toast.style, {
        position: 'fixed',
        bottom: '80px',
        left: '50%',
        transform: 'translateX(-50%) translateY(20px)',
        backgroundColor: 'rgba(1, 24, 58, 0.9)',
        color: '#ffffff',
        padding: '12px 24px',
        borderRadius: '30px',
        fontSize: '14px',
        fontWeight: '500',
        zIndex: '1001',
        boxShadow: '0 4px 15px rgba(0,0,0,0.25)',
        border: '1px solid #c5a059',
        opacity: '0',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        pointerEvents: 'none',
        whiteSpace: 'nowrap'
      });
      document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    
    // Auto hide after 2 seconds
    clearTimeout(window.toastTimeout);
    window.toastTimeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2000);
  }

  // --- Consultation Form Submission & Formatting ---
  const consultForm = document.getElementById('consultForm');
  const userPhone = document.getElementById('userPhone');
  const formSuccess = document.getElementById('formSuccess');
  const formSubmitBtn = document.getElementById('formSubmitBtn');

  // Phone Auto Format (010-XXXX-XXXX)
  if (userPhone) {
    userPhone.addEventListener('input', (e) => {
      let value = e.target.value.replace(/[^0-9]/g, '');
      if (value.length > 3 && value.length <= 7) {
        value = value.slice(0, 3) + '-' + value.slice(3);
      } else if (value.length > 7) {
        value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
      }
      e.target.value = value;
    });
  }

  // Form Submission
  if (consultForm) {
    consultForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Disable button & show loading
      formSubmitBtn.classList.add('loading');
      const originalBtnText = formSubmitBtn.innerHTML;
      formSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>신청 중...</span>';

      const formData = new FormData(consultForm);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      if (!GOOGLE_SHEETS_SCRIPT_URL) {
        // Fallback for local testing when URL is empty
        console.warn('Google Sheets Script URL is empty. Simulating success.');
        setTimeout(() => {
          consultForm.style.display = 'none';
          formSuccess.style.display = 'block';
        }, 1000);
        return;
      }

      // Send to Google Sheets (using form-urlencoded to bypass CORS preflight)
      const urlParams = new URLSearchParams(data);
      fetch(GOOGLE_SHEETS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Critical: bypasses CORS redirect blocking in Apps Script
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: urlParams
      })
      .then(() => {
        consultForm.style.display = 'none';
        formSuccess.style.display = 'block';
      })
      .catch((error) => {
        console.error('Error submitting form:', error);
        alert('상담 신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주시거나 전화로 연락주시기 바랍니다.');
        formSubmitBtn.classList.remove('loading');
        formSubmitBtn.innerHTML = originalBtnText;
      });
    });
  }
});
