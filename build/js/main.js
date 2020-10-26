'use strict';

(function () {
  var callbackModal = document.querySelector('.modal-callback');
  var callbackModalBtn = document.querySelector('.navigation-contacts__callback-button');
  var closeModalBtn = callbackModal.querySelector('.modal-callback__close');
  var formCallback = callbackModal.querySelector('form');
  var anchorSelectors = ['.banner__button', '.banner__scroll-button'];
  var footerItems = document.querySelectorAll(`.footer__navigation, .footer__contacts`);
  var footerItemBtns = document.querySelectorAll('.footer__navigation-button, .footer__contacts-button');
  var phoneInputs = document.querySelectorAll('input[type="tel"]');

  var callbackName = callbackModal.querySelector('#callback-name');
  var callbackPhone = callbackModal.querySelector('#callback-phone');
  var callbackMessage = callbackModal.querySelector('#callback-message');

  var maskOption = {
    mask: '+{7}(000)000-00-00'
  };

  var isStorageSupport = true;
  var storageName = '';
  var storagePhone = '';
  var storageMessage = '';

  try {
    storageName = localStorage.getItem('user-name');
    storagePhone = localStorage.getItem('user-phone');
    storageMessage = localStorage.getItem('user-message');
  } catch (err) {
    isStorageSupport = false;
  }

  function onSendFormSubmitPress(evt) {
    evt.preventDefault();

    if (!callbackName.value) {
      callbackName.focus();
    } else if (callbackName.value && !callbackPhone.value) {
      callbackPhone.focus();
    } else if (callbackName.value && callbackPhone.value && !callbackMessage.value) {
      callbackMessage.focus();
    } else {
      localStorage.setItem('user-name', callbackName.value);
      localStorage.setItem('user-phone', callbackPhone.value);
      localStorage.setItem('user-message', callbackMessage.value);
    }

    closeModal();
  }

  function openModal(evt) {
    evt.preventDefault();

    callbackModal.style.display = 'flex';
    document.body.classList.add('modal-open');

    if (isStorageSupport) {
      if (storageName) {
        callbackName.value = storageName;
        callbackPhone.focus();
      }
      if (storagePhone) {
        callbackPhone.value = storagePhone;
        callbackMessage.focus();
      }
      if (storageMessage) {
        callbackMessage.textContent = storageMessage;
      }
    }

    callbackName.focus();

    document.addEventListener('keydown', onModalCloseEscPress);
  }

  function closeModal() {
    callbackModal.style.display = 'none';
    document.body.classList.remove('modal-open');

    document.removeEventListener('keydown', onModalCloseEscPress);
  }

  function onModalCloseEscPress(evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeModal();
    }
  }

  function onModalCloseOverlayClick(evt) {
    if (evt.target === callbackModal) {
      closeModal();
    }
  }

  function validationInputPhone(inputs) {
    for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i];
      IMask(input, maskOption);
    }
  }

  function setScrollLinkSmooth(evt) {
    evt.preventDefault();

    var anchor = evt.target.closest('[href]').href.split('#');
    document.querySelector('#' + anchor[1]).scrollIntoView({
      behavior: 'smooth'
    });
  }

  function smoothScroll(arr) {
    var scrollLinks = document.querySelectorAll(arr);

    for (var i = 0; i < scrollLinks.length; i++) {
      var link = scrollLinks[i];
      link.addEventListener('click', setScrollLinkSmooth);
    }
  }

  function setInitValueForFooterItems() {
    for (var i = 0; i < footerItems.length; i++) {
      footerItems[i].classList.remove('active');
    }
  }

  function showAndHideContentInFooter(evt) {
    var parent = evt.target.parentNode.parentNode;

    if (parent.classList.contains('active')) {
      parent.classList.remove('active');
    } else {
      for (var j = 0; j < footerItems.length; j++) {
        footerItems[j].classList.remove('active');
      }
      parent.classList.toggle('active');
    }
  }

  for (var i = 0; i < footerItemBtns.length; i++) {
    footerItemBtns[i].addEventListener('click', showAndHideContentInFooter);
  }

  setInitValueForFooterItems()
  validationInputPhone(phoneInputs);
  smoothScroll(anchorSelectors);

  formCallback.addEventListener('submit', onSendFormSubmitPress);
  callbackModalBtn.addEventListener('click', openModal);
  closeModalBtn.addEventListener('click', closeModal);
  window.addEventListener('click', onModalCloseOverlayClick);
})();
