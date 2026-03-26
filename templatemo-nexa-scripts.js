/* JavaScript Document

TemplateMo 603 Nexaverse

https://templatemo.com/tm-603-nexaverse

*/

// Loading Screen
window.addEventListener('load', () => {
   setTimeout(() => {
      document.getElementById('loadingScreen').classList.add('hidden');
   }, 1000);
});

// Menu Item Click Handler
const menuItems = document.querySelectorAll('.menu-item');
const contentSections = document.querySelectorAll('.content-section');
const menuGrid = document.getElementById('menuGrid');
const mainHeader = document.getElementById('mainHeader');
const mainFooter = document.getElementById('mainFooter');
let isTransitioning = false;

const headerVideo = document.querySelector('.header-video');
const videoPopup = document.getElementById('videoPopup');
const videoPopupPlayer = document.getElementById('videoPopupPlayer');
const popupCloseTriggers = document.querySelectorAll('[data-close-video-popup]');
const isTouchLikeDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;
let activeTouchPreviewItem = null;
let headerVideoRetryCount = 0;

function tryPlayHeaderVideo() {
   if (!headerVideo) return;

   headerVideo.muted = true;
   headerVideo.defaultMuted = true;
   headerVideo.autoplay = true;
   headerVideo.loop = true;
   headerVideo.playsInline = true;
   headerVideo.preload = 'auto';
   headerVideo.setAttribute('autoplay', '');
   headerVideo.setAttribute('muted', '');
   headerVideo.setAttribute('loop', '');
   headerVideo.setAttribute('playsinline', '');
   headerVideo.setAttribute('webkit-playsinline', 'true');
   headerVideo.setAttribute('disablepictureinpicture', '');

   headerVideo.play().catch(() => {
      // Mobile browsers may still wait for a user gesture.
   });
}

function forceHeaderVideoPlayback() {
   if (!headerVideo) return;

   tryPlayHeaderVideo();

   if (headerVideo.paused && headerVideoRetryCount < 8) {
      headerVideoRetryCount += 1;
      setTimeout(forceHeaderVideoPlayback, 220);
   }
}

function openVideoPopup() {
   if (!videoPopup || !videoPopupPlayer) return;

   videoPopup.classList.add('active');
   videoPopup.setAttribute('aria-hidden', 'false');
   document.body.classList.add('video-popup-open');

   if (headerVideo && headerVideo.currentTime) {
      videoPopupPlayer.currentTime = headerVideo.currentTime;
   }

   videoPopupPlayer.play().catch(() => {
      // Autoplay may be blocked; controls remain available.
   });
}

function closeVideoPopup() {
   if (!videoPopup || !videoPopupPlayer) return;

   videoPopup.classList.remove('active');
   videoPopup.setAttribute('aria-hidden', 'true');
   document.body.classList.remove('video-popup-open');
   videoPopupPlayer.pause();
}

function openDirectSection(sectionId) {
   const targetSection = document.getElementById(sectionId);
   if (!targetSection) return;

   const activeSection = document.querySelector('.content-section.active');
   if (activeSection && activeSection !== targetSection) {
      activeSection.classList.remove('active');
   }

   menuGrid.style.display = 'none';
   mainHeader.style.display = 'none';
   mainFooter.style.display = 'none';

   targetSection.classList.add('active');

   window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
   document.documentElement.scrollTop = 0;
   document.body.scrollTop = 0;
}

function openSectionFromLocation() {
   const params = new URLSearchParams(window.location.search);
   const requestedSection = params.get('section');
   const fromProject = params.get('fromProject') === '1';

   if (fromProject && requestedSection) {
      const targetSection = document.getElementById(requestedSection);
      if (targetSection && targetSection.classList.contains('content-section')) {
         openDirectSection(requestedSection);
         history.replaceState(null, '', window.location.pathname);
         return;
      }
   }

   if (window.location.hash || window.location.search) {
      history.replaceState(null, '', window.location.pathname);
   }
}

if (mainHeader) {
   mainHeader.addEventListener('click', (event) => {
      if (event.target.closest('.header-contact-btn')) return;
      openVideoPopup();
   });
}

if (headerVideo) {
   window.addEventListener('load', () => {
      headerVideoRetryCount = 0;
      setTimeout(forceHeaderVideoPlayback, 120);
   });

   window.addEventListener('pageshow', () => {
      headerVideoRetryCount = 0;
      forceHeaderVideoPlayback();
   });

   headerVideo.addEventListener('loadedmetadata', forceHeaderVideoPlayback);
   headerVideo.addEventListener('canplay', forceHeaderVideoPlayback);
   headerVideo.addEventListener('ended', () => {
      headerVideo.currentTime = 0;
      forceHeaderVideoPlayback();
   });

   document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
         headerVideoRetryCount = 0;
         forceHeaderVideoPlayback();
      }
   });

   document.addEventListener('touchstart', forceHeaderVideoPlayback, { once: true, passive: true });
   document.addEventListener('pointerdown', forceHeaderVideoPlayback, { once: true, passive: true });
}

popupCloseTriggers.forEach((element) => {
   element.addEventListener('click', closeVideoPopup);
});

window.addEventListener('load', () => {
   openSectionFromLocation();
});

document.addEventListener('keydown', (event) => {
   if (event.key === 'Escape' && videoPopup && videoPopup.classList.contains('active')) {
      closeVideoPopup();
   }
});

menuItems.forEach(item => {
   item.addEventListener('click', () => {
      if (isTransitioning) return;

      const sectionId = item.dataset.section;
      showSection(sectionId);
   });
});

function showSection(sectionId) {
   isTransitioning = true;

   // First, ensure all menu items are in visible state before transitioning
   menuItems.forEach((item) => {
      // Remove initial-load class
      item.classList.remove('initial-load');

      // Set to visible state explicitly
      item.style.opacity = '1';
      item.style.transform = 'translateY(0) scale(1)';
      item.style.animation = 'none';
   });

   // Force reflow to apply the visible state
   void menuGrid.offsetWidth;

   // Now apply staggered fade out transition
   menuItems.forEach((item, index) => {
      setTimeout(() => {
         item.style.transition = 'all 0.4s ease-out';
         item.style.opacity = '0';
         item.style.transform = 'translateY(40px) scale(0.9)';
      }, index * 50);
   });

   // Hide header and footer
   mainHeader.style.animation = 'none';
   mainHeader.style.opacity = '1';
   mainFooter.style.animation = 'none';
   mainFooter.style.opacity = '1';

   void mainHeader.offsetWidth;

   mainHeader.style.transition = 'opacity 0.4s ease';
   mainHeader.style.opacity = '0';
   mainFooter.style.transition = 'opacity 0.4s ease';
   mainFooter.style.opacity = '0';

   // Show content section after menu animation
   setTimeout(() => {
      menuGrid.style.display = 'none';
      mainHeader.style.display = 'none';
      mainFooter.style.display = 'none';

      // Reset menu item styles for next time
      menuItems.forEach(item => {
         item.style.transition = '';
         item.style.opacity = '';
         item.style.transform = '';
         item.classList.remove('exit-up', 'visible');
      });

      const section = document.getElementById(sectionId);
      section.classList.add('active');

      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // Animate stats if introduction section
      if (sectionId === 'introduction') {
         setTimeout(animateStats, 500);
      }

      if (sectionId === 'about') {
         initSkillsTransitionObserver();
         setTimeout(refreshVisibleSkillsTracks, 120);
      }

      isTransitioning = false;
   }, 550);
}

function backToMenu() {
   if (isTransitioning) return;
   isTransitioning = true;

   const activeSection = document.querySelector('.content-section.active');
   if (activeSection) {
      // Get fixed elements that need to fade out
      const sectionHeaderSmall = activeSection.querySelector('.section-header-small');
      const backBtn = activeSection.querySelector('.back-btn');

      // Step 1: Cancel the forwards animation so we can control opacity
      activeSection.style.animation = 'none';
      activeSection.style.opacity = '1'; // Reset to visible state first

      // Force reflow to apply the animation cancel
      void activeSection.offsetWidth;

      // Step 2: Now apply fade out transition to ALL elements
      activeSection.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      activeSection.style.opacity = '0';
      activeSection.style.transform = 'translateY(-20px)';

      if (sectionHeaderSmall) {
         sectionHeaderSmall.style.transition = 'opacity 0.5s ease';
         sectionHeaderSmall.style.opacity = '0';
      }
      if (backBtn) {
         backBtn.style.transition = 'opacity 0.5s ease';
         backBtn.style.opacity = '0';
      }

      // Step 3: Wait for complete fade out
      setTimeout(() => {
         // Hide section completely
         activeSection.classList.remove('active');
         activeSection.style.animation = '';
         activeSection.style.opacity = '';
         activeSection.style.transform = '';
         activeSection.style.transition = '';

         if (sectionHeaderSmall) {
            sectionHeaderSmall.style.opacity = '';
            sectionHeaderSmall.style.transition = '';
         }
         if (backBtn) {
            backBtn.style.opacity = '';
            backBtn.style.transition = '';
         }

         // Step 4: Prepare menu elements (hidden initially)
         menuGrid.style.display = '';
         mainHeader.style.display = 'block';
         mainFooter.style.display = 'block';

         // Cancel CSS animations to prevent re-triggering
         mainHeader.style.animation = 'none';
         mainFooter.style.animation = 'none';

         mainHeader.style.opacity = '0';
         mainHeader.style.transform = 'translateY(20px)';
         mainFooter.style.opacity = '0';

         menuItems.forEach(item => {
            item.classList.remove('exit-up', 'initial-load', 'return', 'visible');
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px) scale(0.9)';
         });

         // Step 5: Brief pause then fade in menu
         setTimeout(() => {
            // Fade in header
            mainHeader.style.transition = 'all 0.5s ease';
            mainHeader.style.opacity = '1';
            mainHeader.style.transform = 'translateY(0)';

            // Fade in footer
            mainFooter.style.transition = 'all 0.5s ease';
            mainFooter.style.opacity = '1';

            // Staggered fade in for menu items
            menuItems.forEach((item, index) => {
               setTimeout(() => {
                  item.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                  item.style.opacity = '1';
                  item.style.transform = 'translateY(0) scale(1)';
               }, index * 80);
            });

            // Step 6: Clean up after all animations complete
            setTimeout(() => {
               mainHeader.style.transition = '';
               mainHeader.style.transform = '';
               mainFooter.style.transition = '';

               menuItems.forEach(item => {
                  item.style.transition = '';
                  item.style.opacity = '';
                  item.style.transform = '';
                  item.classList.add('visible');
               });

               isTransitioning = false;
            }, 600);
         }, 150);
      }, 550);
   }
}

// Animate Stats
function animateStats() {
   const metricValues = document.querySelectorAll('.metric-value[data-target]');
   metricValues.forEach((el, index) => {
      setTimeout(() => {
         const target = parseInt(el.dataset.target);
         let current = 0;
         const increment = target / 40;
         const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
               current = target;
               clearInterval(timer);
            }
            el.textContent = Math.floor(current);
         }, 30);
      }, index * 200);
   });
}

// Tab Switching
function switchTab(btn, tabId) {
   document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
   btn.classList.add('active');

   document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
   document.getElementById(tabId).classList.add('active');
}

// Gallery Filter
function filterGallery(category, btn) {
   document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
   btn.classList.add('active');

   const galleryGrid = document.querySelector('.gallery-grid');
   const items = document.querySelectorAll('.gallery-item');

    if (galleryGrid) {
      galleryGrid.classList.toggle('single-card-view', category !== 'all');
    }

   items.forEach(item => {
      const video = item.querySelector('.gallery-video');

      if (category === 'all' || item.dataset.category === category) {
         item.style.display = 'block';
         item.style.animation = 'tabFade 0.4s ease-out';
      } else {
         item.style.display = 'none';
         if (video) {
            video.pause();
            video.currentTime = 0;
         }
         item.classList.remove('is-playing');
      }
   });
}

let skillsTransitionObserver = null;

function restartTransitionTrack(track) {
   track.style.animation = 'none';
   void track.offsetWidth;
   track.style.animation = '';
   track.style.animationPlayState = 'running';
}

function pauseSkillsTransitionTracks() {
   const tracks = document.querySelectorAll('#about .skills-pane .tech-marquee .tech-track, #about .skills-pane .hardware-cards-track');
   tracks.forEach((track) => {
      track.style.animationPlayState = 'running';
   });
}

function refreshVisibleSkillsTracks() {
   const tracks = document.querySelectorAll('#about .skills-pane .tech-marquee .tech-track, #about .skills-pane .hardware-cards-track');
   tracks.forEach((track) => {
      track.style.animationPlayState = 'running';
   });
}

function initSkillsTransitionObserver() {
   refreshVisibleSkillsTracks();
}

function switchSkillsPane(btn, paneId) {
   const skillsNavButtons = document.querySelectorAll('#about .skills-nav-buttons .filter-btn');
   skillsNavButtons.forEach((navBtn) => navBtn.classList.remove('active'));
   btn.classList.add('active');

   const panes = document.querySelectorAll('#about .skills-pane');
   panes.forEach((pane) => pane.classList.remove('active'));

   const targetPane = document.getElementById(paneId);
   if (targetPane) {
      targetPane.classList.add('active');

      initSkillsTransitionObserver();
      setTimeout(refreshVisibleSkillsTracks, 80);
   }
}

function startGalleryPreview(item, video) {
   item.classList.add('is-playing');
   video.currentTime = 0;
   video.play().catch(() => {
      // Playback can fail depending on browser policy.
   });
}

function stopGalleryPreview(item, video) {
   item.classList.remove('is-playing');
   video.pause();
   video.currentTime = 0;
}

document.querySelectorAll('.gallery-item').forEach((item) => {
   const video = item.querySelector('.gallery-video');
   const targetPage = item.dataset.page;
   if (!video) return;

   video.muted = true;
   video.defaultMuted = true;
   video.loop = true;
   video.playsInline = true;
   video.setAttribute('playsinline', '');
   video.setAttribute('webkit-playsinline', 'true');

   video.addEventListener('loadeddata', () => {
      video.pause();
      video.currentTime = 0;
   });

   if (!isTouchLikeDevice) {
      item.addEventListener('mouseenter', () => {
         startGalleryPreview(item, video);
      });

      item.addEventListener('mouseleave', () => {
         stopGalleryPreview(item, video);
      });
   } else {
      item.addEventListener('touchstart', () => {
         if (activeTouchPreviewItem && activeTouchPreviewItem !== item) {
            const previousVideo = activeTouchPreviewItem.querySelector('.gallery-video');
            if (previousVideo) {
               stopGalleryPreview(activeTouchPreviewItem, previousVideo);
            }
         }

         startGalleryPreview(item, video);
      }, { passive: true });
   }

   if (targetPage) {
      const openTargetPage = () => {
         const sourceSection = item.closest('.content-section')?.id || 'photography';
         const url = new URL(targetPage, window.location.href);
         url.searchParams.set('fromSection', sourceSection);
         window.location.href = url.toString();
      };

      item.addEventListener('click', () => {
         if (isTouchLikeDevice && activeTouchPreviewItem !== item) {
            if (activeTouchPreviewItem && activeTouchPreviewItem !== item) {
               const previousVideo = activeTouchPreviewItem.querySelector('.gallery-video');
               if (previousVideo) {
                  stopGalleryPreview(activeTouchPreviewItem, previousVideo);
               }
            }

            startGalleryPreview(item, video);
            activeTouchPreviewItem = item;
            return;
         }

         openTargetPage();
      });

      item.addEventListener('keydown', (event) => {
         if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openTargetPage();
         }
      });
   }
});

const emailJsConfig = {
   publicKey: 'EthNML6novOyoLgK0',
   serviceId: 'service_4zl0tl6',
   templateId: 'template_w1r41q4'
};

const contactForm = document.getElementById('contactForm');
const contactStatus = document.getElementById('contactFormStatus');
const contactSubmitBtn = document.getElementById('contactSubmitBtn');

if (window.emailjs) {
   emailjs.init({ publicKey: emailJsConfig.publicKey });
}

if (contactForm) {
   contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const nameInput = document.getElementById('contactName');
      const emailInput = document.getElementById('contactEmail');
      const subjectInput = document.getElementById('contactSubject');
      const messageInput = document.getElementById('contactMessage');

      const messageValue = (messageInput?.value || '').trim();

      if (!contactForm.checkValidity()) {
         contactForm.reportValidity();
         return;
      }

      if (messageValue.length < 30) {
         if (contactStatus) {
            contactStatus.textContent = 'Your message must contain at least 30 characters.';
            contactStatus.classList.add('error');
            contactStatus.classList.remove('success');
         }
         messageInput.focus();
         return;
      }

      if (!window.emailjs) {
         if (contactStatus) {
            contactStatus.textContent = 'Email service is not loaded. Please refresh the page.';
            contactStatus.classList.add('error');
            contactStatus.classList.remove('success');
         }
         return;
      }

      if (contactSubmitBtn) {
         contactSubmitBtn.disabled = true;
         contactSubmitBtn.textContent = 'Sending...';
      }

      if (contactStatus) {
         contactStatus.textContent = '';
         contactStatus.classList.remove('error', 'success');
      }

      const templateParams = {
         from_name: nameInput.value.trim(),
         from_email: emailInput.value.trim(),
         name: nameInput.value.trim(),
         email: emailInput.value.trim(),
         subject: subjectInput.value.trim(),
         message: messageValue,
         time: new Date().toLocaleString(),
         to_email: 'benabdellatifbessam@gmail.com'
      };

      try {
         await emailjs.send(emailJsConfig.serviceId, emailJsConfig.templateId, templateParams);

         if (contactStatus) {
            contactStatus.textContent = 'Message sent successfully.';
            contactStatus.classList.add('success');
            contactStatus.classList.remove('error');
         }

         contactForm.reset();
      } catch (error) {
         const errorText = (error && (error.text || error.message)) ? ` (${error.text || error.message})` : '';

         if (contactStatus) {
            contactStatus.textContent = `Error sending message. Please try again${errorText}`;
            contactStatus.classList.add('error');
            contactStatus.classList.remove('success');
         }

         console.error('EmailJS error:', error);
      } finally {
         if (contactSubmitBtn) {
            contactSubmitBtn.disabled = false;
            contactSubmitBtn.textContent = 'Send Message';
         }
      }
   });
}