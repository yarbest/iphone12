document.addEventListener('DOMContentLoaded', () => {
    const getData = (url, callback) => {
        const request = new XMLHttpRequest();
        request.open('GET', url);
        request.send();
        request.addEventListener('load', (event) => {
            if (request.status === 200) {
                callback(JSON.parse(request.response));
            } else {
                console.error(new Error(`Данные не были получены, ошибка: ${request.status} ${request.statusText}`));
            }
        });
    };

    const changeTab = () => {
        const btnsChangeTabList = document.querySelector('.card-detail__buttons');
        const cardTitleEl = document.querySelector('.card-details__title');
        const cardImageEl = document.querySelector('.card__image_item');
        const cardPrice = document.querySelector('.card-details__price');
        const cardMemory = document.querySelector('.description__memory');
        let btnsChangeTabEl; //кнопки добавятся потом, вот когда добавятся тогда и соберем коллекцию.
        //А переменную объявил глобально, так как коллекция будет собирать внутри функции
        //количество кнопок зависит от колличества телефонов в cardData

        const cardData = [
            {
                title: 'Смартфон Apple iPhone 12 Pro 128GB Graphite',
                image: 'img/iPhone-graphite.png',
                price: 99990,
                memory: 128,
            },
            {
                title: 'Смартфон Apple iPhone 12 Pro 128GB Silver',
                image: 'img/iPhone-silver.png',
                price: 109990,
                memory: 128,
            },
            {
                title: 'Смартфон Apple iPhone 12 Pro 256GB Pacific Blue',
                image: 'img/iPhone-blue.png',
                price: 119990,
                memory: 256,
            },
            {
                title: 'Смартфон Apple iPhone 12 Pro 512GB Bloody Red',
                image: 'https://m.media-amazon.com/images/I/6154ZbwZJxL._AC_SL1500_.jpg',
                price: 150000,
                memory: 512,
            },
            {
                title: 'Смартфон Apple iPhone 12 Pro 512GB Bloody Red',
                image: 'https://m.media-amazon.com/images/I/6154ZbwZJxL._AC_SL1500_.jpg',
                price: 150000,
                memory: 512,
            },
        ];

        //вставляем кнопки на страницу в зависимости от количества телефонов
        const insertButtons = () => {
            cardData.forEach((obj) => {
                let phoneColor = obj.title.match(/(?<=GB\s)\w+\s?\w+/);
                btnsChangeTabList.insertAdjacentHTML(
                    'beforeend',
                    `<li class="card-details__wrap-btn">
                        <button class="card-detail__change" type="button">${phoneColor}</button>
                    </li>`
                );
            });
            btnsChangeTabList.firstElementChild.firstElementChild.classList.add('active');
            btnsChangeTabEl = document.querySelectorAll('.card-detail__change'); //собираем в коллекцию созданные кнопки
        };
        insertButtons();

        btnsChangeTabEl.forEach((btn) => {
            btn.addEventListener('click', (event) => {
                const target = event.target;

                if (target.classList.contains('card-detail__change')) {
                    btnsChangeTabEl.forEach((btn, indexChosenTab) => {
                        //порядок кнопок соответствует порядку телефонов в cardData
                        //поэтому если мы нажали на вторую кнопку, то нужно использовать данные второго телефона
                        if (target === btn) {
                            cardTitleEl.textContent = cardData[indexChosenTab].title;
                            cardImageEl.src = cardData[indexChosenTab].image;
                            cardPrice.textContent = cardData[indexChosenTab].price + '₽';
                            cardMemory.textContent = `Встроенная память (ROM) ${cardData[indexChosenTab].memory} ГБ`;
                        }

                        btn.classList.remove('active'); //так как эта строка находистся в цикле, то она выполнится для всех кнопок
                    });

                    target.classList.add('active'); //делаем активной нажатую кнопку
                }
            });
        });
    };
    changeTab();

    const accordion = () => {
        const characteristicsListElem = document.querySelector('.characteristics__list');
        const characteristicsItemElems = document.querySelectorAll('.characteristics__item');

        //делаем первую вкладку открытой по умолчанию
        characteristicsItemElems[0].querySelector('.characteristics__description').style.height =
            characteristicsItemElems[0].querySelector('.characteristics__description').scrollHeight + 'px';
        characteristicsItemElems[0].querySelector('.characteristics__title').classList.add('active');

        characteristicsListElem.addEventListener('click', (event) => {
            const target = event.target;

            if (target.matches('.characteristics__title')) {
                target.classList.toggle('active');

                //это элемент после кнопки. можно было его получить через target.nextElementSibling, но если в верстке появится какая-то обертка, и изменится порядок, то все сломается
                let divDescription = target.closest('.characteristics__item').querySelector('.characteristics__description');
                //target - это кнопка, а divDescription - это div.characteristics__description который нужно раскрывать

                //открываем один аккордион
                if (divDescription.style.height === '') divDescription.style.height = divDescription.scrollHeight + 'px';
                else divDescription.style.height = ''; //закрываем один аккордион

                //закрываем все аккордионы, кроме одного, на который нажали
                characteristicsItemElems.forEach((li) => {
                    if (li.querySelector('.characteristics__title') === target) return; //закрываем всех, кроме того, на который нажали
                    li.querySelector('.characteristics__description').style.height = '';
                    li.querySelector('.characteristics__title').classList.remove('active');
                });
            }
        });
    };
    accordion();

    const openCloseModal = () => {
        const modalWindow = document.querySelector('.modal');
        const btnOpenModal = document.querySelector('.card-details__button_buy');
        const btnOpenModalWithDelivery = document.querySelector('.card-details__button_delivery');
        const modalTitle = document.querySelector('.modal__title');
        const modalSubtitle = document.querySelector('.modal__subtitle');
        const nameGood = document.querySelector('[name=name-good]');
        const deliveryChosen = document.querySelector('[name=delivery-chosen]');
        const cardTitle = document.querySelector('.card-details__title');

        const openModal = (event) => {
            modalWindow.classList.add('open');
            modalTitle.textContent = cardTitle.textContent;
            modalSubtitle.textContent = event.target.dataset.buyType; //текст побзаголовка зависит от того, на какую кнопку мы нажали, Купить или Купить с досавкой
            nameGood.value = cardTitle.textContent.match(/\w+(\s\w+)*/g); //скрытое поле

            //Если нажали на кнопку с доставкой, то спрятанный чекбокс будет 'on'
            if (event.target === btnOpenModal) {
                deliveryChosen.checked = false;
            } else if (event.target === btnOpenModalWithDelivery) {
                deliveryChosen.checked = true;
            }

            document.addEventListener('keydown', closeModal); //обработчик на document будет висеть только при открытой модалке
        };

        const closeModal = (event) => {
            // Если пользователь нажмет Esc или кликнет на оверлэй, то данное условие пропустится, функция продолжится и модалка закроется
            if (event.key !== 'Escape' && event.type !== 'click') return;

            modalWindow.classList.remove('open');
            allowScroll();

            document.removeEventListener('keydown', closeModal);
        };

        const blockScroll = () => {
            const scrollBarWidth = window.innerWidth - document.documentElement.offsetWidth; //ширина скролбара
            document.body.style.overflow = 'hidden'; //запрет прокрутки при открытом модальном окне
            //так как при запрете прокрутки, сам скролбар  пропадает, то все содержимое смещается в право на ширину скролбара, поэтому это нужно компенсировать отступом
            document.body.style.paddingRight = `${scrollBarWidth}px`;
        };

        const allowScroll = () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            document.body.removeAttribute('style');
        };

        btnOpenModal.addEventListener('click', (event) => {
            openModal(event);
            blockScroll();
        });

        btnOpenModalWithDelivery.addEventListener('click', (event) => {
            openModal(event);
            blockScroll();
        });

        modalWindow.addEventListener('click', (event) => {
            const target = event.target;

            if (target.matches('.modal__close') || target.matches('.modal')) {
                closeModal(event);
            }
        });
    };
    openCloseModal();

    const renderCrossSell = () => {
        const crossSellList = document.querySelector('.cross-sell__list');
        const btnShowMore = document.createElement('button');
        btnShowMore.classList.add('show-more');
        btnShowMore.textContent = 'Показать еще';

        const fillSellList = (responseWithGoods, amountGoodsToAdd) => {
            responseWithGoods.forEach((objectWithGoodInfo, i) => {
                if (i >= amountGoodsToAdd) return; //больше этого количества товаров за один раз не добавлять

                crossSellList.insertAdjacentHTML(
                    'beforeend',
                    `
                    <li>
                        <article class="cross-sell__item">
                            <img class="cross-sell__image" src="${objectWithGoodInfo.photo}" alt="${objectWithGoodInfo.name}" />
                            <h3 class="cross-sell__title">${objectWithGoodInfo.name}</h3>
                            <p class="cross-sell__price">${objectWithGoodInfo.price}₽</p>
                            <button class="button button_buy cross-sell__button">Купить</button>
                        </article>
                    </li>
                    `
                );
            });

            for (let i = 0; i < amountGoodsToAdd; i++) {
                //Удаляем те товары, которые показали
                responseWithGoods.shift();
            }
            if (responseWithGoods.length <= 0) btnShowMore.remove(); //если товаров больше нет, то кнопку убираем
        };

        //ВАЖНО эта функця будет передаваться колбэком в функцию для запроса на сервер (getData),
        //и будет вызываться там, там ей в параметр передадут ответ от сервера с данными о товарах
        const handleResponse = (responseWithGoods) => {
            const amountGoodsToAdd = window.innerWidth < 937 ? 6 : 4; //в зависимости от ширины устройства, определяется колво товаров при добавлении

            responseWithGoods.sort(() => Math.random() - 0.5); //перемешиваем массив результатов

            fillSellList(responseWithGoods, amountGoodsToAdd); //выводим первую порцию товаров

            crossSellList.insertAdjacentElement('afterend', btnShowMore); //показываем кнопку только после загрузки первой партии товаров

            btnShowMore.addEventListener('click', () => {
                fillSellList(responseWithGoods, amountGoodsToAdd); //при каждом клике выводится новая партия товаров
            });
        };

        //данный url написан относитель html, так как браузер будет делать запрос на сервер
        getData('cross-sell-dbase/dbase.json', handleResponse);
    };

    renderCrossSell();
});
