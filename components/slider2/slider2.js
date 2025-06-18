export default function initializeSlickSlider2() {
  $('.slider2').slick({
    slidesToShow: 7,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
    dots: false,
    prevArrow: '<button type="button" class="slick-prev custom-arrow"><img src="../../assets/images/icons/arrow-left.png" alt="Previous"></button>',
    nextArrow: '<button type="button" class="slick-next custom-arrow"><img src="../../assets/images/icons/arrow-tlid-u-r.svg" alt="Next"></button>',
    responsive: [
      {
        breakpoint: 1000,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 }
      }
    ]
  });
}
