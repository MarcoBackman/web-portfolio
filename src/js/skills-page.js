function setDetailPanelPosition() {
    //On initial loads
    $(document).ready(function () {
        if (window.scrollY < 150) {
            $(".skill-detail-panel").css("top", "250px");
        } else {
            $(".skill-detail-panel").css("top", "5%");
        }
    });

    //Dynamic scroll event
    window.addEventListener('scroll', (event) => {
        if (this.scrollY < 150) {
            $(".skill-detail-panel").css("top", "250px");
        } else if (this.scrollY > 1400) { //Todo: refactor this to calculate the percentage instead
            $(".skill-detail-panel").css("top", "1%");
        } else {
            $(".skill-detail-panel").css("top", "5%");
        }
    });
}