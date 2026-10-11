/* Google Analytics 4. Paste your Measurement ID below (looks like G-XXXXXXXXXX). Leave empty to keep analytics off. */
(function(){
  var GA_ID = '';
  if(!GA_ID) return;
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments)}
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID);
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
  document.head.appendChild(s);
  // Track WhatsApp, email and phone clicks as events
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a'); if(!a) return;
    var h = a.getAttribute('href') || '';
    var t = a.id === 'wa' || h.indexOf('wa.me') > -1 ? 'whatsapp' : h.indexOf('mailto:') === 0 ? 'email' : h.indexOf('tel:') === 0 ? 'phone' : '';
    if(t) gtag('event', 'contact_click', {method: t, page: location.pathname});
  });
})();
