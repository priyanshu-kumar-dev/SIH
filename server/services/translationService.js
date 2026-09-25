const { translateWithAI } = require("../services/llmService");

const translateText = async (req, res) => {
try {
const { text, from, to } = req.body;

```
console.log("Translation request:", {
  text,
  from,
  to,
});

if (!text || !from || !to) {
  return res.status(400).json({
    success: false,
    message: "Text, from and to are required.",
  });
}

const translation = await translateWithAI(
  text,
  from,
  to
);

return res.status(200).json({
  success: true,
  translation,
});
```

} catch (error) {
console.error(
"Translation controller error:",
error
);

```
return res.status(500).json({
  success: false,
  message:
    error.message ||
    "Translation failed.",
});
```

}
};

module.exports = {
translateText,
};
