

const myAlert = (message)=> {
    alert(message)
}



export default function initializeSlick() {
  $('.logo-slider').slick({
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    dots: false,
    responsive: [
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 2 }
      }
    ]
  });
}


