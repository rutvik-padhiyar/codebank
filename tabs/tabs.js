$(document).ready(function() {
    $('#tab-1').show();
    $('.tabs__trigger').click(function() {
        var tagid = $(this).attr('href');
        $('.tab__content').hide();
        $(tagid).show();
        $('.tabs__trigger').removeClass('active');
        $(this).addClass('active');
        //$(tagid).siblings().hide();
        return false;
    });
});