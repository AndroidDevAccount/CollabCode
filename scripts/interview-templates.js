(function() {
  window.InterviewTemplates = {
    'csharp-warmup': {
      title: 'C# Very Simple Warm-up',
      language: 'csharp',
      content: `// 5-minute C# warm-up
//
// Complete AddPositiveNumbers.
// Add only numbers greater than zero and return the total.
//
// Example: { 10, -2, 5, 0 } should return 15.

using System;

public class Program
{
    public static int AddPositiveNumbers(int[] numbers)
    {
        // Write your code here.
        return 0;
    }

    public static void Main()
    {
        Console.WriteLine(AddPositiveNumbers(
            new int[] { 10, -2, 5, 0 })); // Expected: 15
    }
}`,
      answerKey: `PLAIN-ENGLISH ANSWER
Start a total at zero. Loop through every number. If the number is greater
than zero, add it to the total. Return the total after the loop.

ONE GOOD SOLUTION
public static int AddPositiveNumbers(int[] numbers)
{
    int total = 0;
    foreach (int number in numbers)
    {
        if (number > 0)
            total += number;
    }
    return total;
}

HOW TO GRADE (0–3)
3 — Produces 15, ignores -2 and 0, and can explain the loop.
2 — Mostly correct with one small syntax/logic mistake they can fix with a hint.
1 — Understands that a loop and total are needed but cannot complete it.
0 — Cannot describe how to add the positive values.

Do not penalize formatting or whether they use foreach, for, or LINQ.`
    },

    'csharp-rest-api': {
      title: 'C# Public REST API Test',
      language: 'csharp',
      content: `// 5-minute REST API question
//
// We are using JSONPlaceholder, a free API made for testing.
//
// Documentation:
// https://jsonplaceholder.typicode.com/
//
// Request:
// GET https://jsonplaceholder.typicode.com/todos/1
//
// Expected response shape:
// {
//   "userId": 1,
//   "id": 1,
//   "title": "delectus aut autem",
//   "completed": false
// }
//
// Task: Complete GetTodoAsync using exactly these steps:
// 1. Send a GET request to "todos/1".
// 2. Throw an error if the response is not successful.
// 3. Read and return the response body as text.
//
// Before coding, open this URL in a browser to confirm the API is available:
// https://jsonplaceholder.typicode.com/todos/1
//
// The interview editor's hosted C# runner might not allow outbound HTTP.
// Grade the method itself and ask the candidate to explain each line.

using System;
using System.Net.Http;
using System.Threading.Tasks;

public class TodoClient
{
    private readonly HttpClient _client;

    public TodoClient(HttpClient client)
    {
        _client = client;
    }

    public async Task<string> GetTodoAsync()
    {
        // Write 3 lines here.
        return "";
    }
}

public class Program
{
    public static async Task Main()
    {
        using var httpClient = new HttpClient
        {
            BaseAddress = new Uri("https://jsonplaceholder.typicode.com/")
        };

        var todoClient = new TodoClient(httpClient);
        string json = await todoClient.GetTodoAsync();
        Console.WriteLine(json);
    }
}`,
      answerKey: `PLAIN-ENGLISH ANSWER
Use the provided HttpClient to send a GET request. Check that the server
returned success. Then read and return the response text.

ONE GOOD SOLUTION
var response = await _client.GetAsync("todos/1");
response.EnsureSuccessStatusCode();
return await response.Content.ReadAsStringAsync();

WHAT EACH LINE DOES
1. GetAsync sends an HTTP GET and waits for the real server response.
2. EnsureSuccessStatusCode throws if the server returns 4xx or 5xx.
3. ReadAsStringAsync reads the JSON response body into a string.

EXPECTED RESULT
Opening the endpoint in a browser should show JSON containing:
- "id": 1
- "title": "delectus aut autem"
- "completed": false

HOW TO GRADE (0–3)
3 — Writes all three lines correctly and can explain request, status, and body.
2 — Gets and returns the response but misses the status check or needs a hint.
1 — Knows an HTTP GET is needed but cannot form the method.
0 — Creates unrelated code or cannot explain request versus response.

BONUS DISCUSSION (do not require)
- API keys belong in configuration, not source code.
- Production code should accept a CancellationToken.
- JSON would normally be deserialized into a C# Todo model.
- HttpClient should usually be injected rather than recreated per request.`
    },

    'aspnet-mvc': {
      title: 'ASP.NET MVC Validation',
      language: 'csharp',
      content: `// 5-minute ASP.NET MVC question
//
// If the form is invalid, show the same view again.
// If it is valid, save it and go to the Index page.

[HttpPost]
public async Task<IActionResult> Create(PolicyViewModel model)
{
    // Add the missing validation check here.

    await _policyService.CreateAsync(model);
    return RedirectToAction("Index");
}`,
      answerKey: `PLAIN-ENGLISH ANSWER
Before saving, ask MVC whether validation failed. If it did, return the same
view with the entered model so the user can correct it.

ONE GOOD SOLUTION
if (!ModelState.IsValid)
{
    return View(model);
}

await _policyService.CreateAsync(model);
return RedirectToAction("Index");

HOW TO GRADE (0–3)
3 — Correct ModelState check, returns View(model), saves only when valid.
2 — Correct idea with a small syntax mistake or returns View() without model.
1 — Says validation must happen but does not know ModelState.
0 — Always saves invalid input or cannot explain the two paths.

BONUS: Redirecting after success prevents accidental duplicate form posts.`
    },

    'sql-policy-query': {
      title: 'SQL Server Simple Join',
      language: 'sql',
      content: `-- 5-minute SQL Server question
--
-- Customers(CustomerId, Name)
-- Policies(PolicyId, CustomerId, PolicyNumber, Status)
--
-- Return the customer name and policy number for Active policies.

SELECT
    -- Write the two columns here
FROM Customers c
    -- Add the JOIN to Policies here
WHERE
    -- Keep only Active policies here
;`,
      answerKey: `PLAIN-ENGLISH ANSWER
Select Name from Customers and PolicyNumber from Policies. Join the tables
where their CustomerId values match. Filter Status to Active.

ONE GOOD SOLUTION
SELECT
    c.Name,
    p.PolicyNumber
FROM Customers c
INNER JOIN Policies p ON p.CustomerId = c.CustomerId
WHERE p.Status = 'Active';

HOW TO GRADE (0–3)
3 — Correct columns, JOIN condition, and Active filter.
2 — Right structure with one minor alias or syntax error.
1 — Can explain matching CustomerId but cannot write the JOIN.
0 — No relationship between the tables or uses unrelated columns.

Important: INNER JOIN or JOIN are both correct here.`
    },

    'ef-linq': {
      title: 'LINQ Simple Filter',
      language: 'csharp',
      content: `// 5-minute LINQ question
//
// Complete the query so it returns the names of active employees,
// sorted alphabetically.

var names = employees
    // Filter IsActive == true
    // Sort by Name
    // Select Name
    .ToList();`,
      answerKey: `PLAIN-ENGLISH ANSWER
Filter the list to active employees, sort those employees by name, and then
select just each employee's name.

ONE GOOD SOLUTION
var names = employees
    .Where(e => e.IsActive)
    .OrderBy(e => e.Name)
    .Select(e => e.Name)
    .ToList();

HOW TO GRADE (0–3)
3 — Correct Where, OrderBy, Select, and ToList sequence.
2 — Gets two of the three operations or fixes the third with a hint.
1 — Understands filtering but cannot express a LINQ lambda.
0 — Cannot identify IsActive as the filter.

BONUS: With Entity Framework, this query is normally translated into SQL.`
    },

    'solid-refactor': {
      title: 'SOLID Single Responsibility',
      language: 'csharp',
      content: `// 5-minute SOLID question
//
// This class saves a policy AND sends an email.
// What are its two responsibilities?
// Name two interfaces you could inject to separate them.

public class PolicyService
{
    public void CreatePolicy(Policy policy)
    {
        // Saves policy to SQL Server
        SaveToDatabase(policy);

        // Sends confirmation email
        SendEmail(policy.CustomerEmail);
    }
}

// Write your answer as comments below:
// Responsibility 1:
// Responsibility 2:
// Interface 1:
// Interface 2:`,
      answerKey: `PLAIN-ENGLISH ANSWER
The class has two jobs: storing policy data and sending email. Separating them
makes each part easier to change and test.

ONE GOOD ANSWER
// Responsibility 1: Save/read policy data.
// Responsibility 2: Send policy notifications.
// Interface 1: IPolicyRepository
// Interface 2: IEmailService (or INotificationService)

HOW TO GRADE (0–3)
3 — Clearly identifies both jobs and proposes two sensible interfaces.
2 — Identifies both jobs but names only one interface or needs a hint.
1 — Says "too much in one class" without identifying the two jobs.
0 — Cannot see any reason to separate database and email work.

Do not require memorized SOLID definitions. Practical reasoning is better.`
    },

    'csharp-debugging': {
      title: 'C# Simple Debugging',
      language: 'csharp',
      content: `// 5-minute C# debugging question
//
// This should return the average of 10 and 20, which is 15.
// Find and fix the bug.

using System;

public class Program
{
    public static int Average(int first, int second)
    {
        int total = first + second;
        return total; // Bug is on this line.
    }

    public static void Main()
    {
        Console.WriteLine(Average(10, 20)); // Expected: 15
    }
}`,
      answerKey: `PLAIN-ENGLISH ANSWER
The method returns the total (30), but an average is the total divided by the
number of values (2).

ONE GOOD FIX
return total / 2;

HOW TO GRADE (0–3)
3 — Changes the return to total / 2 and gets 15.
2 — Explains division is missing but makes a small syntax mistake.
1 — Recognizes 30 is wrong but cannot state the average formula.
0 — Cannot identify why the method returns 30.

OPTIONAL FOLLOW-UP
Ask what Average(10, 21) returns. With int it returns 15, not 15.5. A decimal
or double return type would preserve the fractional part.`
    },

    'dotnet-interview-plan': {
      title: 'Simple .NET Interview Plan',
      language: 'markdown',
      content: `# Simple junior .NET interview plan

Each coding question is intended to take about 5 minutes.

1. C# — Very Simple Warm-up
2. C# — Simple Debugging
3. SQL Server — Simple Join
4. LINQ — Simple Filter
5. ASP.NET MVC — Validation
6. C# — REST API Basics
7. SOLID — Single Responsibility

Suggested approach:
- Read the prompt aloud.
- Let the candidate ask questions.
- Give one small hint after about two minutes.
- Ask them to run the runnable C# questions.
- Use the interviewer-only Answer Key button for grading.
- Small syntax mistakes matter less than understanding.`,
      answerKey: `OVERALL GRADING
Each exercise has a 0–3 score in its own Answer Key.

Suggested total for 7 questions: 21 points
18–21 — Strong junior performance
14–17 — Reasonable junior performance; discuss weak areas
9–13  — Significant gaps; consider experience claims carefully
0–8   — Fundamentals were not demonstrated

This is only a guide. Communication, honesty, response to hints, and ability
to explain their own resume should influence the final decision.

Good signs:
- Explains what they are doing.
- Tests the result instead of guessing.
- Accepts a hint and applies it.
- Says when they do not know something.

Warning signs:
- Cannot explain code they just wrote.
- Gives memorized terms without concrete meaning.
- Claims the editor is the problem before reading simple errors.
- Resume examples cannot be described in practical detail.`
    }
  };
})();
