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
      title: 'ASP.NET MVC — Form Validation',
      language: 'csharp',
      content: `// 5-minute ASP.NET MVC question
//
// The Razor page below submits a Policy Number to this controller.
// A browser's "required" check can be bypassed, so the controller must
// also reject a blank PolicyNumber.
//
// Complete the two TODOs in the controller:
// 1. Add a field-specific validation error when PolicyNumber is blank.
// 2. If validation failed, show the form again with the entered values.

// Create.cshtml (frontend)
// -----------------------
// @model PolicyViewModel
//
// <form asp-action="Create" method="post">
//     <label asp-for="PolicyNumber"></label>
//     <input asp-for="PolicyNumber" required />
//     <span asp-validation-for="PolicyNumber"></span>
//     <button type="submit">Save</button>
// </form>

using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

public class PolicyViewModel
{
    public string PolicyNumber { get; set; } = "";
}

[HttpPost]
[ValidateAntiForgeryToken]
public async Task<IActionResult> Create(PolicyViewModel model)
{
    // TODO 1: If PolicyNumber is blank, add this message to ModelState:
    // "Policy number is required."

    // TODO 2: If ModelState is invalid, return View(model).

    await _policyService.CreateAsync(model);
    return RedirectToAction("Index");
}`,
      answerKey: `PLAIN-ENGLISH ANSWER
The HTML "required" attribute helps the user, but it is not security: a request
can skip the browser. The controller checks PolicyNumber again. It adds an
error for that field, then returns the same view and model when validation
failed. The <span asp-validation-for="PolicyNumber"> displays the message.

ONE GOOD SOLUTION
if (string.IsNullOrWhiteSpace(model.PolicyNumber))
{
    ModelState.AddModelError(
        nameof(model.PolicyNumber),
        "Policy number is required.");
}

if (!ModelState.IsValid)
{
    return View(model);
}

await _policyService.CreateAsync(model);
return RedirectToAction("Index");

HOW TO GRADE (0-3)
3 — Adds a field-specific ModelState error, returns View(model) when invalid,
    and saves only valid input.
2 — Correct server-side check and invalid return, with a small syntax mistake
    or a non-field-specific error.
1 — Understands that the server must validate, but cannot implement both TODOs.
0 — Relies only on HTML "required" or still saves a blank PolicyNumber.

WHAT TO LISTEN FOR
- The browser check improves usability; server validation protects the app.
- Returning View(model) preserves what the user typed and shows the error.
- Redirecting after success helps prevent an accidental duplicate form post.

ALTERNATIVE
A [Required] attribute on PolicyNumber is also a good production approach.
If the candidate uses it correctly and still checks ModelState, give full credit.`
    },

    'sql-policy-query': {
      title: 'SQL Server Simple Join',
      language: 'sql',
      content: `-- 5-minute SQL Server question
--
-- TABLES
--
-- Customers
-- +------------+---------------+
-- | CustomerId | Name          |
-- +------------+---------------+
-- | 1          | Alice Johnson |
-- | 2          | Bob Smith     |
-- | 3          | Carla Gomez   |
-- +------------+---------------+
--
-- Policies
-- +----------+------------+--------------+-----------+
-- | PolicyId | CustomerId | PolicyNumber | Status    |
-- +----------+------------+--------------+-----------+
-- | 101      | 1          | AUTO-1001    | Active    |
-- | 102      | 1          | HOME-2001    | Cancelled |
-- | 103      | 2          | AUTO-1002    | Active    |
-- | 104      | 3          | LIFE-3001    | Pending   |
-- +----------+------------+--------------+-----------+
--
-- CustomerId connects each policy to its customer. For example,
-- policy AUTO-1001 has CustomerId 1, so it belongs to Alice Johnson.
--
-- TASK
-- Return the customer name and policy number for Active policies only.
--
-- EXPECTED RESULT
-- +---------------+--------------+
-- | Name          | PolicyNumber |
-- +---------------+--------------+
-- | Alice Johnson | AUTO-1001    |
-- | Bob Smith     | AUTO-1002    |
-- +---------------+--------------+

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
// Each Employee object has these fields:
// - Id: the employee's unique number
// - Name: the employee's full name
// - Department: the team where the employee works
// - IsActive: true if the employee currently works for the company
//
// SAMPLE DATA
// Id | Name          | Department | IsActive
// 1  | Carla Gomez   | Claims     | true
// 2  | Bob Smith     | Sales      | false
// 3  | Alice Johnson | Claims     | true
//
// Complete the query so it returns the names of active employees,
// sorted alphabetically.
//
// EXPECTED RESULT
// Alice Johnson
// Carla Gomez

using System.Collections.Generic;
using System.Linq;

var employees = new List<Employee>
{
    new Employee { Id = 1, Name = "Carla Gomez", Department = "Claims", IsActive = true },
    new Employee { Id = 2, Name = "Bob Smith", Department = "Sales", IsActive = false },
    new Employee { Id = 3, Name = "Alice Johnson", Department = "Claims", IsActive = true }
};

var names = employees
    // Filter IsActive == true
    // Sort by Name
    // Select Name
    .ToList();

public class Employee
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Department { get; set; } = "";
    public bool IsActive { get; set; }
}`,
      answerKey: `PLAIN-ENGLISH ANSWER
Filter the list to active employees, sort those employees by name, and then
select just each employee's name. Bob is removed because IsActive is false.
Alice appears before Carla because OrderBy sorts the names alphabetically.

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

    'ef-migration': {
      title: 'Entity Framework — Add a Field',
      language: 'csharp',
      content: `// 5-minute Entity Framework Core question
//
// DAY-TO-DAY SCENARIO
// This Policy class already exists in a working application and its SQL Server
// table already contains policy records.
//
// The business now wants to store an optional renewal date. Old policies might
// not have a renewal date, so the new field must allow null.
//
// Complete these two tasks:
// 1. Add a nullable RenewalDate field to the Policy class.
// 2. Write the commands you would run to create and apply an EF Core migration.

using System;

public class Policy
{
    public int Id { get; set; }
    public string PolicyNumber { get; set; } = "";
    public string CustomerName { get; set; } = "";
    public decimal Premium { get; set; }

    // TODO 1: Add the nullable RenewalDate property here.
}

// TODO 2: Write the two EF Core commands as comments:
// Create migration:
// Apply migration:`,
      answerKey: `PLAIN-ENGLISH ANSWER
Entity Framework maps the Policy class to a database table. Changing the C#
class alone does not update the existing SQL Server table. A migration records
the required schema change, and the database-update command applies it.

The question says the date is optional. DateTime is a value type, so DateTime?
is used to allow null. Existing database rows can then have NULL in the new
RenewalDate column.

ONE GOOD MODEL CHANGE
public DateTime? RenewalDate { get; set; }

GOOD COMMANDS — .NET CLI
dotnet ef migrations add AddRenewalDateToPolicy
dotnet ef database update

ALSO CORRECT — VISUAL STUDIO PACKAGE MANAGER CONSOLE
Add-Migration AddRenewalDateToPolicy
Update-Database

The migration name is chosen by the developer; any clear name is acceptable.

HOW TO GRADE (0-3)
3 — Adds DateTime?, creates a migration, and applies it with correct commands.
2 — Correct nullable property and remembers migrations, but misses or slightly
    mistypes one command.
1 — Adds DateTime or DateTime? but does not know how the database is updated.
0 — Only edits SQL manually or cannot connect the model change to the database.

WHAT TO LISTEN FOR
- Nullable avoids inventing a date for existing policies.
- The generated migration should be reviewed before applying it.
- Production migrations should follow the team's deployment process; developers
  should not casually update a production database from their laptop.

DO NOT PENALIZE
Accept either the dotnet CLI or Package Manager Console command style.`
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
      answerKey: `WHAT IS SOLID?
SOLID is a set of five guidelines for organizing object-oriented code so it is
easier to change, test, and maintain:

S — Single Responsibility:
    A class should have one main job or one reason to change.
O — Open/Closed:
    Add new behavior without repeatedly rewriting stable existing code.
L — Liskov Substitution:
    A replacement implementation should work wherever its interface is expected.
I — Interface Segregation:
    Prefer small, focused interfaces over one large interface with unrelated jobs.
D — Dependency Inversion:
    Business code should depend on interfaces, not directly on database or email
    implementations.

Do not expect the candidate to recite all five definitions. This exercise mainly
tests the S: Single Responsibility Principle.

WHAT IS WRONG WITH THIS CLASS?
PolicyService has two unrelated jobs:
1. Storing policy data in SQL Server.
2. Sending an email notification.

It therefore has two reasons to change. A database change and an email-provider
change would both require editing the same class. Separating those jobs also
makes the code easier to test: a test can substitute fake implementations
instead of connecting to a real database or sending a real email.

ONE GOOD ANSWER
// Responsibility 1: Save/read policy data.
// Responsibility 2: Send policy notifications.
// Interface 1: IPolicyRepository
// Interface 2: IEmailService (or INotificationService)

WHAT "INJECT THE INTERFACES" MEANS
The class receives the two helpers, usually through its constructor, instead of
creating a SQL connection or email sender itself:

public PolicyService(
    IPolicyRepository policies,
    IEmailService email)
{
    _policies = policies;
    _email = email;
}

CreatePolicy would then call _policies.Save(policy) and
_email.SendConfirmation(policy.CustomerEmail). The exact names do not matter.

HOW TO GRADE (0–3)
3 — Clearly identifies both jobs and proposes two sensible interfaces.
2 — Identifies both jobs but names only one interface or needs a hint.
1 — Says "too much in one class" without identifying the two jobs.
0 — Cannot see any reason to separate database and email work.

INTERVIEWER TIP
Give full credit for names such as IPolicyDataService, IRepository,
INotificationService, or IMailer when their intended jobs are clear. Practical
reasoning matters more than memorizing the acronym.`
    },

    'csharp-debugging': {
      title: 'C# Easy — Running Sum',
      language: 'csharp',
      content: `// 5-minute LeetCode-style Easy question
//
// Given an array of integers, return its running sum.
// Each result position contains the sum of all numbers up to that position.
//
// EXAMPLE
// Input:    [1, 2, 3, 4]
// Output:   [1, 3, 6, 10]
//
// Explanation:
// result[0] = 1
// result[1] = 1 + 2 = 3
// result[2] = 1 + 2 + 3 = 6
// result[3] = 1 + 2 + 3 + 4 = 10
//
// Complete RunningSum. You may modify and return the input array,
// or create and return a new array.

using System;

public class Program
{
    public static int[] RunningSum(int[] numbers)
    {
        // Write your loop here.
        return numbers;
    }

    public static void Main()
    {
        int[] result = RunningSum(new int[] { 1, 2, 3, 4 });
        Console.WriteLine(string.Join(", ", result)); // Expected: 1, 3, 6, 10
    }
}`,
      answerKey: `PLAIN-ENGLISH ANSWER
Walk through the array from left to right while remembering the total so far.
Add the current number to that total, then store the total at the current
position. For [1, 2, 3, 4], the remembered totals are 1, 3, 6, and 10.

ONE GOOD SOLUTION
public static int[] RunningSum(int[] numbers)
{
    int total = 0;

    for (int i = 0; i < numbers.Length; i++)
    {
        total += numbers[i];
        numbers[i] = total;
    }

    return numbers;
}

HOW TO GRADE (0–3)
3 — Produces [1, 3, 6, 10] with one loop and returns the array.
2 — Understands the running total but has a small indexing or syntax mistake.
1 — Can calculate the example manually but cannot turn it into a loop.
0 — Adds only neighboring values or returns the unchanged input.

OPTIONAL FOLLOW-UP
Ask for the time and space complexity:
- Time is O(n) because every number is visited once.
- Extra space is O(1) for this solution because it modifies the input array.

ALSO ACCEPT
A separate result array is completely correct. Its extra space is O(n).`
    },

    'dotnet-interview-plan': {
      title: 'Your Junior .NET Interview',
      language: 'markdown',
      content: `# Welcome to your junior .NET interview

You will work through eight short exercises. Each one is intended to take about
five minutes. The goal is to understand how you approach a problem—not to test
whether you have memorized every piece of syntax.

## What we will cover

1. C# — Simple warm-up
2. C# — Easy Running Sum
3. SQL Server — Simple Join
4. LINQ — Simple Filter
5. Entity Framework — Add a Field and Migration
6. ASP.NET MVC — Validation
7. C# — REST API Basics
8. SOLID — Single Responsibility

## How to approach each exercise

- Read the prompt carefully and ask questions if anything is unclear.
- Talk through what you are thinking as you work.
- Write the clearest solution you can; small syntax mistakes are okay.
- You may write notes or pseudocode before writing the final code.
- If you get stuck, say where you are stuck. The interviewer may offer a hint.
- Explain your finished answer and how you would check that it works.

It is completely okay to say that you do not remember something. Clear
reasoning, honest communication, and learning from a hint are all valuable.`,
      answerKey: `OVERALL GRADING
Each exercise has a 0–3 score in its own Answer Key.

Suggested total for 8 questions: 24 points
21–24 — Strong junior performance
16–20 — Reasonable junior performance; discuss weak areas
10–15 — Significant gaps; consider experience claims carefully
0–9   — Fundamentals were not demonstrated

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
