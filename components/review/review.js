

export default function initializeReviewSlider() {
  $('.review-slider').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
  });
}