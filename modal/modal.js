$(document).ready(function() {
    const modal = () => {
        const $modal = $('[data-modal]');
        const $close = $('[data-close]');
        const $body = $('body');
        const open = 'modal-open';
        const show = 'show';

        $modal.on('click', function() {
            const id = $(this).data('modal');

            $body.addClass(open);
            $(id).addClass(show);
        });

        $close.on('click', function() {
            $body.removeClass(open);
            $('.modal').removeClass(show);
            return false;
        });
    }

    modal();
});