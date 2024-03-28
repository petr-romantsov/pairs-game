"use strict";

(() => {

    //объявляем глобальные переменные
    const game = document.getElementById('pairs-game');

    let numbersArray = [];
    let firstCard = null;
    let secondCard = null;

    //создаем заголовок
    function createTitle() {
        const gameTitle = document.createElement('h1');
        gameTitle.textContent = 'Игра в пары';
        const gameDescr = document.createElement('p');
        gameDescr.textContent = 'Чтобы начать игру вам нужно ввести желаемое количество карточек по вертикали/горизонтали в поле ниже. Количество карточек должно быть четным. Минимальное количество карточек - 2, максимальное - 10.';

        return {
            gameTitle,
            gameDescr,
        }
    }

    //создаем форму
    function createForm () {
        const form = document.createElement('form');
        const input = document.createElement('input');
        const button = document.createElement('button');
        button.textContent = 'Начать игру';

        form.classList.add('form');
        input.classList.add('input');
        button.classList.add('button');

        form.append(createTitle().gameDescr);
        form.append(input);
        form.append(button);

        return {
            form,
            input,
            button,
        }
    }

    //создаем лист
    function createList () {
        let gameList = document.createElement('ul');
        gameList.classList.add('list');


        return gameList;
    }


    //функция-генератор массива парных чисел
    function createNumbersArray(count) {
        for (let i = 1; i <= count; i++) {
         numbersArray.push(i, i);
        }
     }


    //функция перемешивания массива
    function shuffle(arr) {

        for (let i = 0; i < arr.length; i++) {
            let j = Math.floor(Math.random() * arr.length);

            let temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }

    //запуск игры
    function startGame() {
        //создаем страницу игры
        const title = createTitle();
        const helloForm = createForm();
        const input = helloForm.input;
        const list = createList();
        game.append(title.gameTitle);
        game.append(helloForm.form);
        game.append(list);

        //
        helloForm.form.addEventListener('submit', (e) => {
            e.preventDefault();

            //проверка вводимого пользователем значения
            if (input.value % 2 !== 0 || input.value > 10 ) {
                input.value = 4;
            } else if (input.value < 2) {
                input.value = 4;
            }

            //установка количества карточек по горизонтали
            list.style.cssText += `--cards-count: ${input.value}`;

            //вычисление количества пар
            function getPairsCount (value) {
                let pairsCount = value * value / 2;

                return pairsCount;
            }

            // создаем массив с парными числами
            createNumbersArray(getPairsCount(input.value));

            //перемешиваем массив
            shuffle(numbersArray);

            //скрываем форму
            helloForm.form.style.display = 'none';

            //создаем игровое поле
            for (let number of numbersArray) {
                const card = document.createElement('li');
                card.textContent = number;
                card.classList.add('card');
                list.append(card);

                //добавляем обработчик клика
                card.addEventListener('click', () => {

                    //проверка, чтобы нельзя было кликнуть на уже открытую карточку
                    if (card.classList.contains('open') || card.classList.contains('success')) {
                        return;
                    }

                    //проверка для 3го клика, чтобы 2 открытые карточки закрылись
                    if (firstCard !== null && secondCard !== null) {
                        firstCard.classList.remove('open', 'animate__flipInY');
                        secondCard.classList.remove('open', 'animate__flipInY');

                        //обнуление переменных открытых карточек
                        firstCard = null;
                        secondCard = null;
                    }

                    //стилизация и анимация открытия карточки
                    card.classList.add('open', 'animate__animated', 'animate__flipInY');

                    //запоминание открытых карточек
                    if (firstCard == null) {
                        firstCard = card;
                    } else {
                        secondCard = card;
                    }

                    //сравнение открытых карточек
                    if (firstCard !== null && secondCard !== null) {
                        let firstCardNumber = firstCard.textContent;
                        let secondCardNumber = secondCard.textContent;

                        if (firstCardNumber == secondCardNumber) {
                            firstCard.classList.add('success');
                            secondCard.classList.add('success');
                        }
                    }

                    //проверка для вычисления победы в игре
                    if (numbersArray.length == document.querySelectorAll('.success').length) {

                        //таймаут, чтобы сначала открылась последняя карточка и только потом вышел алерт
                        setTimeout(() => {

                            alert('Это победа!');

                            //добавление кнопки "сыграть еще раз"
                            const playAgain = document.createElement('button');
                            playAgain.classList.add('button');
                            playAgain.textContent = 'Сыграть еще раз';
                            game.append(playAgain);

                            //запуск игры заново с кнопки
                            playAgain.addEventListener('click', () => {
                                game.innerHTML = '';
                                numbersArray = [];
                                startGame();
                            })

                        }, 400)
                    }

                })
            }
        })


    }

    startGame();
})();
