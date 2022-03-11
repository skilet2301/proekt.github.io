//для активного меню
window.addEventListener('scroll', () => {
   let scrollDistance = window.scrollY;

   if (window.innerWidth > 400) {
      document.querySelectorAll('.section').forEach((el, i) => {
         if (el.offsetTop - document.querySelector('.menu').clientHeight <= scrollDistance) {
            document.querySelectorAll('.menu a').forEach((el) => {
               if (el.classList.contains('active')) {
                  el.classList.remove('active');
               }
            });

            document.querySelectorAll('.menu li')[i].querySelector('a').classList.add('active');
         }
      });
   }
});


//для комфортного скролла в якорях
$('a[href^="#"]').click(function () {
   let valHref = $(this).attr("href");
   $("html,body").animate({ scrollTop: $(valHref).offset().top - 50 + "px" });
});



//для модального окна с изображением
$('.image-link').magnificPopup({ type: 'image' });



//для слайдера с отзывами
var slider = (function (config) {

   const ClassName = {
      INDICATOR_ACTIVE: 'slider__indicator_active',
      ITEM: 'slider__item',
      ITEM_LEFT: 'slider__item_left',
      ITEM_RIGHT: 'slider__item_right',
      ITEM_PREV: 'slider__item_prev',
      ITEM_NEXT: 'slider__item_next',
      ITEM_ACTIVE: 'slider__item_active'
   }

   var
      _isSliding = false, // индикация процесса смены слайда
      _interval = 0, // числовой идентификатор таймера
      _transitionDuration = 700, // длительность перехода
      _slider = {}, // DOM элемент слайдера
      _items = {}, // .slider-item (массив слайдов) 
      _sliderIndicators = {}, // [data-slide-to] (индикаторы)
      _config = {
         selector: '', // селектор слайдера
         isCycling: true, // автоматическая смена слайдов
         direction: 'next', // направление смены слайдов
         interval: 5000, // интервал между автоматической сменой слайдов
         pause: true // устанавливать ли паузу при поднесении курсора к слайдеру
      };

   var
      // функция для получения порядкового индекса элемента
      _getItemIndex = function (_currentItem) {
         var result;
         _items.forEach(function (item, index) {
            if (item === _currentItem) {
               result = index;
            }
         });
         return result;
      },
      // функция для подсветки активного индикатора
      _setActiveIndicator = function (_activeIndex, _targetIndex) {
         if (_sliderIndicators.length !== _items.length) {
            return;
         }
         _sliderIndicators[_activeIndex].classList.remove(ClassName.INDICATOR_ACTIVE);
         _sliderIndicators[_targetIndex].classList.add(ClassName.INDICATOR_ACTIVE);
      },

      // функция для смены слайда
      _slide = function (direction, activeItemIndex, targetItemIndex) {
         var
            directionalClassName = ClassName.ITEM_RIGHT,
            orderClassName = ClassName.ITEM_PREV,
            activeItem = _items[activeItemIndex], // текущий элемент
            targetItem = _items[targetItemIndex]; // следующий элемент

         var _slideEndTransition = function () {
            activeItem.classList.remove(ClassName.ITEM_ACTIVE);
            activeItem.classList.remove(directionalClassName);
            targetItem.classList.remove(orderClassName);
            targetItem.classList.remove(directionalClassName);
            targetItem.classList.add(ClassName.ITEM_ACTIVE);
            window.setTimeout(function () {
               if (_config.isCycling) {
                  clearInterval(_interval);
                  _cycle();
               }
               _isSliding = false;
               activeItem.removeEventListener('transitionend', _slideEndTransition);
            }, _transitionDuration);
         };

         if (_isSliding) {
            return; // завершаем выполнение функции если идёт процесс смены слайда
         }
         _isSliding = true; // устанавливаем переменной значение true (идёт процесс смены слайда)

         if (direction === "next") { // устанавливаем значение классов в зависимости от направления
            directionalClassName = ClassName.ITEM_LEFT;
            orderClassName = ClassName.ITEM_NEXT;
         }

         targetItem.classList.add(orderClassName); // устанавливаем положение элемента перед трансформацией
         _setActiveIndicator(activeItemIndex, targetItemIndex); // устанавливаем активный индикатор

         window.setTimeout(function () { // запускаем трансформацию
            targetItem.classList.add(directionalClassName);
            activeItem.classList.add(directionalClassName);
            activeItem.addEventListener('transitionend', _slideEndTransition);
         }, 0);

      },
      // функция для перехода к предыдущему или следующему слайду
      _slideTo = function (direction) {
         var
            activeItem = _slider.querySelector('.' + ClassName.ITEM_ACTIVE), // текущий элемент
            activeItemIndex = _getItemIndex(activeItem), // индекс текущего элемента 
            lastItemIndex = _items.length - 1, // индекс последнего элемента
            targetItemIndex = activeItemIndex === 0 ? lastItemIndex : activeItemIndex - 1;
         if (direction === "next") { // определяем индекс следующего слайда в зависимости от направления
            targetItemIndex = activeItemIndex == lastItemIndex ? 0 : activeItemIndex + 1;
         }
         _slide(direction, activeItemIndex, targetItemIndex);
      },
      // функция для запуска автоматической смены слайдов в указанном направлении
      _cycle = function () {
         if (_config.isCycling) {
            _interval = window.setInterval(function () {
               _slideTo(_config.direction);
            }, _config.interval);
         }
      },
      // обработка события click
      _actionClick = function (e) {
         var
            activeItem = _slider.querySelector('.' + ClassName.ITEM_ACTIVE), // текущий элемент
            activeItemIndex = _getItemIndex(activeItem), // индекс текущего элемента
            targetItemIndex = e.target.getAttribute('data-slide-to');

         if (!(e.target.hasAttribute('data-slide-to') || e.target.classList.contains('slider__control'))) {
            return; // завершаем если клик пришёлся на не соответствующие элементы
         }
         if (e.target.hasAttribute('data-slide-to')) {// осуществляем переход на указанный сдайд 
            if (activeItemIndex === targetItemIndex) {
               return;
            }
            _slide((targetItemIndex > activeItemIndex) ? 'next' : 'prev', activeItemIndex, targetItemIndex);
         } else {
            e.preventDefault();
            _slideTo(e.target.classList.contains('slider__control_next') ? 'next' : 'prev');
         }
      },
      // установка обработчиков событий
      _setupListeners = function () {
         // добавление к слайдеру обработчика события click
         _slider.addEventListener('click', _actionClick);
         // остановка автоматической смены слайдов (при нахождении курсора над слайдером)
         if (_config.pause && _config.isCycling) {
            _slider.addEventListener('mouseenter', function (e) {
               clearInterval(_interval);
            });
            _slider.addEventListener('mouseleave', function (e) {
               clearInterval(_interval);
               _cycle();
            });
         }
      };

   // init (инициализация слайдера)
   for (var key in config) {
      if (key in _config) {
         _config[key] = config[key];
      }
   }
   _slider = (typeof _config.selector === 'string' ? document.querySelector(_config.selector) : _config.selector);
   _items = _slider.querySelectorAll('.' + ClassName.ITEM);
   _sliderIndicators = _slider.querySelectorAll('[data-slide-to]');
   // запуск функции cycle
   _cycle();
   _setupListeners();

   return {
      next: function () { // метод next 
         _slideTo('next');
      },
      prev: function () { // метод prev 
         _slideTo('prev');
      },
      stop: function () { // метод stop
         clearInterval(_interval);
      },
      cycle: function () { // метод cycle 
         clearInterval(_interval);
         _cycle();
      }
   }
}({
   selector: '.slider',
   isCycling: false,
   direction: 'next',
   interval: 5000,
   pause: true
}));

//для расчёта стоимости по кнопке
/*
$('#js-button').click(function () {
   var value = $('#price').val();
   var value2 = $('#price2').val();
   var value3 = $('#price3').val();
   value = Number.parseInt(value);
   value2 = Number.parseInt(value2);
   value3 = Number.parseInt(value3);
   $('#js-result').html(value + value2 + value3 + ' руб.');
});
*/

//для расчёта стоимости при изменении данных
$('select').change(sum);

function sum() {
   var value = $('#price').val();
   var value2 = $('#price2').val();
   var value3 = $('#price3').val();
   value = Number.parseInt(value);
   value2 = Number.parseInt(value2);
   value3 = Number.parseInt(value3);
   $('#js-result').html(value + value2 + value3 + ' руб.');
}

$('select').change(sum3);

function sum3() {
   var Value = $("#price2").find('option:selected').data('value');
   var Value2 = $("#price").find('option:selected').data('value');
   var Value3 = $("#price3").find('option:selected').data('value');
   Value = Number.parseInt(Value);
   Value2 = Number.parseInt(Value2);
   Value3 = Number.parseInt(Value3);
   $('#js-result2').html(Value + Value2 + Value3 + ' дней');
}

$('select').change(sum4);
function sum4() {
   var Value = $("#price4").find('option:selected').data('value');
   var Value2 = $("#price5").find('option:selected').data('value');
   var Value3 = $("#price6").find('option:selected').data('value');
   Value = Number.parseInt(Value);
   Value2 = Number.parseInt(Value2);
   Value3 = Number.parseInt(Value3)
   $('#js-result3').html(Value + Value2 + Value3 + ' дней');
}



$('select').change(sum1);

function sum1() {
   var value = $('#price4').val();
   var value2 = $('#price5').val();
   var value3 = $('#price6').val();
   value = Number.parseInt(value);
   value2 = Number.parseInt(value2);
   value3 = Number.parseInt(value3);
   $('#js-result1').html(value + value2 + value3 + ' руб.');
}

//для автоматического модального окна
var win_top = 0;
$(document).ready(function () {

   // открываем модальное окно при клике по контенту
   $('#list').click(function () {
      popup_open('#myPopup');
   })

   setTimeout(function () {
      popup_open('#myPopup')
   }, 30000)


   // Добавляем обработчик закрытия модального окна
   $(document).on('click', '.popup .close, .overflow', function () {
      popup_close()
      return false;
   })

})

function popup_open(selector) {
   if (selector.length) {
      win_top = $(window).scrollTop();
      $('#list').css({
         'position': 'fixed',
         'left': '0',
         'right': '0',
         'top': '0',
         // Добавляем смещение, чтобы на фоне была именно та часть, что просмаривал пользователь
         'margin-top': '-' + win_top + 'px'
      })
      $('.overflow,' + selector).fadeIn();
   }
}
function popup_close() {
   $('.overflow, .popup').hide();
   $('#list').css({
      'position': 'static',
      'margin-top': '0px'
   })
   // Возвращаем скролл на место
   $(window).scrollTop(win_top);
}



let options = { threshold: [0.8] };
let observer = new IntersectionObserver(onEntry, options);
let elements = $('.element-animation');
elements.each((i, el) => {
   observer.observe(el);
});

function onEntry(entry) {
   entry.forEach(change => {
      if (change.isIntersecting) {
         change.target.classList.add('show-animation');
         //для фото ДЗ change.target.src = change.target.dataset.src
      }
   });
};


//для ввода номера в модальном окне
$("#inputTel").mask("+7(999) 999-99-99");
$("#inputTel2").mask("+7(999) 999-99-99");


// работает как required, но для IOS
/*
$('form').submit(function (event) {
   if ($("#inputTel").val() == "" || $("#inputEmail").val() == "") {
      event.preventDefault();
      alert('Введите текст');
   };
})
*/

//Отправка формы без перезагрузки сайта
$('form').submit(function (event) {
   event.preventDefault();

   $.ajax({
      type: "POST",
      url: "php/mail.php",
      data: $(this).serialize()

   }).done(function () {

      $(this).find("input").val("");
      alert("Успешно отправлено!");
      $('form').trigger("reset");
   })
   return false;

});



