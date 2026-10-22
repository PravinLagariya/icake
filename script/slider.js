$(function () {
  $(".hero-slider").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 800,
    fade: true,
    cssEase: "ease-in-out",
    pauseOnHover: false,
    adaptiveHeight: false,
  });
});
