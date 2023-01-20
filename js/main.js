function getEditDistance(a, b) {
  // from https://en.wikibooks.org/wiki/Algorithm_Implementation/Strings/Levenshtein_distance#JavaScript
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  var matrix = [];
  var i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  var j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) == a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
      }
    }
  }
  return matrix[b.length][a.length];
};

function kmin(arr, f) {
  ret = arr[0]
  mv = f(ret)
  for (let i = 1; i < arr.length; i++) {
    v = f(arr[i])
    if (v < mv) {
      mv = v
      ret = arr[i]
    }
  }
  return ret
}

const { createApp } = Vue
const app = createApp({
  data() {
    return {
      words: [],
      num: '',
      uwords: ''
    }
  },
  methods: {
    change_base(n, b) {
      n = BigInt(n)
      b = BigInt(b)
      ids = []
      while (n > 0) {
        ids.push(n % b)
        n /= b
      }
      return ids
    }
  },
  computed: {
    swords() {
      return new Set(this.words)
    },
    N() {
      return this.words.length
    },
    magic_words() {
      if (!this.num || !this.num.match(/^\d+(e\d+)?$/)) return ''
      ret = this.change_base(this.num, this.N).map(i => this.words[i])
      return ret.join(' ')
    },
    gnum() {
      if (!this.uwords || !this.uwords.match(/^[a-zA-Z]+( [a-zA-Z]+)*$/)) return ''
      arr = this.uwords.split(' ').map(w => w.toLowerCase())
      for (const w of arr) {
        if (!this.swords.has(w)) {
          sim = kmin(this.words, wi => getEditDistance(wi, w))
          return `"${w}" isn't one of the words, did you mean ${sim}?`
        }
      }
      return arr.reduce((s,e,i) => s + (BigInt(this.words.indexOf(e)) * (BigInt(this.N)**BigInt(i))), 0n)
    }
  }
}).mount('#app')

// Load words
fetch('words.json').then(resp => resp.json()).then(words => app.words = words)