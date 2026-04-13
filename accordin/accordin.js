$(document).ready(function() {
     $('.accordin__trigger').not(this).removeClass('active');
        $('.accordin__content').not($(this).next()).slideUp();
        $(this).addClass('active');
        $(this).next('.accordin__content').slideDown();
});
