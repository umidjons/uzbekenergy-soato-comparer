# `SOATO` comparer for UzbekEnergy

Sample `SOATO` data file - `data/soato.txt`:

```
03202,Алтынкульское ЭСП,123456789,00123,АНДИЖОН Ш., "УЗСАНОАТКУРИЛИШБАНКИ" ОАТБ,12345678901234567890
03203,Андижанское ЭСП,523456789,00123,АНДИЖОН Ш., "УЗСАНОАТКУРИЛИШБАНКИ" ОАТБ,12345678901234567899
```

*NOTE* Content of the `data/soato.txt` must be on `UTF-8`. One can convert it to `UTF-8` with for example `Sublime Text`.

Sample existing `SOATO` json file - `data/existing.json`:

```json
{
  "values": [
    {
      "value": "03202",
      "title": {
        "ru": "03202 - Алтынкульское ЭП",
        "uz": "03202 - Алтынкульское ЭП"
      },
      "filter": "03"
    },
    {
      "value": "03203",
      "title": {
        "ru": "03203 - Андижанское ЭП",
        "uz": "03203 - Андижанское ЭП"
      },
      "filter": "26"
    }
  ]
}
```

Set values of necessary variables:

```js
const existings       = require('./data/existing.json').values; // Existing SOATO entries
const FILE_IN         = './data/soato.txt';                     // CAUTION: content must be on UTF-8
const FILE_OUT        = './out/soato.json';                     // Parsed SOATO entries
const FILE_DELETED    = './out/soato_deleted.json';             // Deleted entries
const FILE_ADDED      = './out/soato_added.json';               // New entries
const FILE_DIFF_NAMES = './out/soato_changed_names.json';       // Entries with different titles
```

Run the script:

```bash
node index
```

Then you can check `out/` folder for results.
