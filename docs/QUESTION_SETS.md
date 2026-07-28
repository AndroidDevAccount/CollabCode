# Custom interview question sets

Administrators can choose a built-in question set from the interview toolbar or
select **Import Set** to load their own JSON file.

An imported file has this shape:

```json
{
  "name": "Backend Fundamentals",
  "description": "A short custom interview for backend candidates.",
  "questions": [
    {
      "title": "C# — Calculate a Total",
      "language": "csharp",
      "content": "// Starter code shown to the candidate",
      "answerKey": "Interviewer-only answer and grading guidance"
    }
  ]
}
```

See [question-set-example.json](question-set-example.json) for an importable
example. Every question requires `title`, `language`, `content`, and `answerKey`.
The language must match one supported by the editor, such as `csharp`, `sql`,
`javascript`, `html`, or `markdown`.

Imported sets are validated and saved in that browser's local storage. They are
not uploaded to the server or written into the shared interview session.
Importing another file with the same `id` updates that set. Administrators using
a shared computer should clear site data after importing confidential material.
