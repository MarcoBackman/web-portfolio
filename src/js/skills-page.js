const PANEL_TOP_POSITION = "150px";

function setDetailPanelPosition() {
    //On initial loads
    $(document).ready(function () {
        if (window.scrollY < 150) {
            $(".skill-detail-panel").css("top", PANEL_TOP_POSITION);
        } else {
            $(".skill-detail-panel").css("top", "5%");
        }
    });

    //Dynamic scroll event
    window.addEventListener('scroll', (event) => {
        if (this.scrollY < 100) {
            $(".skill-detail-panel").css("top", PANEL_TOP_POSITION);
        } else if (this.scrollY > 1400) { //Todo: refactor this to calculate the percentage instead
            $(".skill-detail-panel").css("top", "1%");
        } else {
            $(".skill-detail-panel").css("top", "5%");
        }
    });
}

// function viewDescription() {
//     document.querySelectorAll('gridbox').forEach(function(element) {
//         element.addEventListener('click', function() {
//             const skillDetailPanel = this.querySelector('.skill-detail-panel');
//             if (skillDetailPanel) {
//                 skillDetailPanel.style.visibility = 'visible';
//             }
//         });
//     });
// }