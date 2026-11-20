Vue.createApp({
  data() {
    return {
      // カードの元データ
      cardImages: [
        { name: "モンド", image: "images/mnd.webp" },
        { name: "璃月", image: "images/ry.webp" },
        { name: "稲妻", image: "images/iz.webp" },
        { name: "スメール", image: "images/sm.webp" },
        { name: "フォンテーヌ", image: "images/ft.webp" },
        { name: "ナタ", image: "images/nt.webp" },
        { name: "ナド・クライ", image: "images/nc.webp" },
        { name: "スネージナヤ", image: "images/sn.webp" },
      ],

      // ゲームで使用するカード
      cards: [],

      // めくったカード
      flippedCards: [],

      // ターン数
      turns: 0,

      // ペア成立数
      matchedPairs: 0,

      // カード操作の制限
      lockBoard: false
    };
  },

  computed: {
    // ゲームクリア判定
    isGameClear() {
      return this.matchedPairs === this.cardImages.length;
    }
  },

  methods: {
    // カードを生成する
    createCards() {
      const cards = [];

      this.cardImages.forEach((item, index) => {
        // 同じカードを2枚作成
        for (let i = 0; i < 2; i++) {
          cards.push({
            id: cards.length,
            imageId: index,
            name: item.name,
            image: item.image,
            flipped: false,
            matched: false
          });
        }
      });

      // カードをシャッフル
      cards.sort(() => Math.random() - 0.5);

      this.cards = cards;
    },

    // カードをめくる
    flipCard(card) {
      // 操作できない場合は終了
      if (this.lockBoard || card.flipped || card.matched) {
        return;
      }

      // カードを表向きにする
      card.flipped = true;

      // めくったカードを配列に追加
      this.flippedCards.push(card);

      // 2枚めくった場合
      if (this.flippedCards.length === 2) {
        this.turns++;
        this.checkMatch();
      }
    },

    // ペア判定
    checkMatch() {
      const [card1, card2] = this.flippedCards;

      // 同じ画像かどうかを判定
      if (card1.imageId === card2.imageId) {
        // ペア成立
        card1.matched = true;
        card2.matched = true;

        this.matchedPairs++;
        this.flippedCards = [];
      } else {
        // ペア不成立
        this.lockBoard = true;

        setTimeout(() => {
          card1.flipped = false;
          card2.flipped = false;

          this.flippedCards = [];
          this.lockBoard = false;
        }, 1000);
      }
    },

    // ゲームをリスタートする
    restartGame() {
      this.flippedCards = [];
      this.turns = 0;
      this.matchedPairs = 0;
      this.lockBoard = false;

      this.createCards();
    }
  }
}).mount("#app");