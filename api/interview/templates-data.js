'use strict';

module.exports = {
    'csharp-warmup': {
      title: 'C# Warm-up — Annual Premium',
      language: 'csharp',
      content: `// 5-minute C# warm-up
//
// We are starting a small insurance application.
//
// Complete CalculateAnnualPremium.
// A policy costs the same amount each month, so multiply the monthly
// premium by 12 and return the result.
//
// Example: a monthly premium of 100.00 should return 1200.00.

using System;

public class Program
{
    public static decimal CalculateAnnualPremium(decimal monthlyPremium)
    {
        // Write one line here.
        return 0m;
    }

    public static void Main()
    {
        Console.WriteLine(
            CalculateAnnualPremium(100.00m)); // Expected: 1200.00
    }
}`,
      answerKey: `PLAIN-ENGLISH ANSWER
There are 12 months in a year, so multiply the monthly premium by 12. The
decimal type is commonly used for money because it represents decimal values
more predictably than float or double.

ONE GOOD SOLUTION
public static decimal CalculateAnnualPremium(decimal monthlyPremium)
{
    return monthlyPremium * 12;
}

HOW TO GRADE (0–3)
3 — Returns monthlyPremium * 12 and can explain the result.
2 — Has the correct multiplication with a small syntax or return-type mistake.
1 — Understands the annual amount uses 12 months but cannot write the return.
0 — Cannot identify the calculation.

Do not require input validation or rounding in this warm-up. The point is to
help the candidate get comfortable before creating the insurance classes.`
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
// Complete the two TODOs:
// 1. Add a validation attribute to PolicyNumber so it is required.
// 2. In the controller, show the form again when validation failed.

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
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

public class PolicyViewModel
{
    // TODO 1: Make this required with the message:
    // "Policy number is required."
    public string PolicyNumber { get; set; } = "";
}

[HttpPost]
[ValidateAntiForgeryToken]
public async Task<IActionResult> Create(PolicyViewModel model)
{
    // TODO 2: If ModelState is invalid, return View(model).

    await _policyService.CreateAsync(model);
    return RedirectToAction("Index");
}`,
      answerKey: `PLAIN-ENGLISH ANSWER
The HTML "required" attribute helps the user, but it is not security: a request
can skip the browser. In MVC, a normal required-field rule belongs on the view
model as a [Required] data annotation. Model binding runs that validation on the
server and adds any failure to ModelState. The controller returns the same view
when ModelState is invalid, and <span asp-validation-for="PolicyNumber">
displays the field's error message.

ONE GOOD SOLUTION
[Required(ErrorMessage = "Policy number is required.")]
public string PolicyNumber { get; set; } = "";

if (!ModelState.IsValid)
{
    return View(model);
}

await _policyService.CreateAsync(model);
return RedirectToAction("Index");

HOW TO GRADE (0-3)
3 — Adds [Required], returns View(model) when ModelState is invalid, and saves
    only valid input.
2 — Uses the correct validation pattern with a small syntax mistake, missing
    custom message, or returns View() without preserving the model.
1 — Understands that the server must validate, but cannot implement both TODOs.
0 — Relies only on HTML "required" or still saves a blank PolicyNumber.

WHAT TO LISTEN FOR
- The browser check improves usability; server validation protects the app.
- Returning View(model) preserves what the user typed and shows the error.
- Redirecting after success helps prevent an accidental duplicate form post.

WHEN ModelState.AddModelError IS APPROPRIATE
Manual errors are still useful for rules that a simple attribute cannot express,
such as "this policy number already exists" after checking the database:

ModelState.AddModelError(
    nameof(model.PolicyNumber),
    "That policy number already exists.");

WEB FORMS NOTE
Setting an error label or using validator controls is familiar in ASP.NET Web
Forms. In ASP.NET MVC, validation attributes + ModelState +
asp-validation-for are the conventional equivalent.`
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
      title: 'SOLID Dependency Injection',
      language: 'csharp',
      content: `// 5-minute SOLID question
//
// The repository is already passed into the constructor as an interface.
// The email sender is still created directly inside PolicyService.
//
// Refactor PolicyService so IEmailService is also constructor-injected:
// 1. Change the _email field to IEmailService.
// 2. Add IEmailService email to the constructor.
// 3. Assign it to _email.
// 4. Do not create EmailSender directly.
//
// Which SOLID letter does this change demonstrate most directly?

public class PolicyService
{
    private readonly IPolicyRepository _policies;
    private readonly EmailSender _email = new EmailSender();

    public PolicyService(IPolicyRepository policies)
    {
        _policies = policies;
    }

    public void CreatePolicy(Policy policy)
    {
        _policies.Save(policy);
        _email.SendConfirmation(policy.CustomerEmail);
    }
}

// SOLID letter:`,
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
tests the D: Dependency Inversion Principle and basic constructor injection.

WHAT IS WRONG WITH THIS CLASS?
The repository already follows Dependency Inversion: PolicyService depends on
IPolicyRepository rather than constructing a SQL repository. Email does not:
new EmailSender() permanently couples the class to that implementation. It is
harder to replace the email provider and harder to test without sending email.

ONE GOOD SOLUTION
public class PolicyService
{
    private readonly IPolicyRepository _policies;
    private readonly IEmailService _email;

    public PolicyService(
        IPolicyRepository policies,
        IEmailService email)
    {
        _policies = policies;
        _email = email;
    }

    public void CreatePolicy(Policy policy)
    {
        _policies.Save(policy);
        _email.SendConfirmation(policy.CustomerEmail);
    }
}

// SOLID letter: D — Dependency Inversion

WHY THIS HELPS
A production application can inject a real email service. A unit test can inject
a fake email service that records the call without sending anything.

SINGLE RESPONSIBILITY CONNECTION
IPolicyRepository owns persistence and IEmailService owns email delivery.
PolicyService can reasonably coordinate the single "create a policy" workflow.
The clearest problem shown by new EmailSender() is the concrete dependency, so
Dependency Inversion is the primary answer.

HOW TO GRADE (0–3)
3 — Injects IEmailService through the constructor, stores it in the field,
    removes new EmailSender(), and identifies D/Dependency Inversion.
2 — Correctly performs the constructor refactor but cannot name the principle,
    or identifies the principle with a small code mistake.
1 — Says an interface would help testing but cannot wire it into the constructor.
0 — Leaves new EmailSender() in place or cannot explain the direct dependency.

INTERVIEWER TIP
IEmailService, INotificationService, or IMailer are all reasonable names. Give
credit for practical understanding even if the candidate calls this dependency
injection without remembering the words "Dependency Inversion."`
    },

    'csharp-debugging': {
      title: 'C# OOP — Model Customers and Policies',
      language: 'csharp',
      content: `// 5-minute C# object-oriented design question
//
// We are continuing the small insurance application from the warm-up.
// Right now, its information is written as one loose list:
//
// Customer ID: 1
// Customer name: Alice Johnson
// Customer email: alice@example.com
// Policy ID: 101
// Policy number: AUTO-1001
// Status: Active
// Premium: 125.50
//
// YOUR TASK
// Break this information into two C# classes: Customer and Policy.
//
// Customer should contain:
// - Id
// - Name
// - Email
//
// Policy should contain:
// - Id
// - PolicyNumber
// - Status
// - Premium
// - A Customer property connecting the policy to its owner
//
// Choose sensible C# types and create both classes below.

`,
      answerKey: `PLAIN-ENGLISH ANSWER
The customer and policy are different concepts, so each gets its own class.
Policy refers to a Customer object instead of repeating the customer's name and
email. This relationship is called composition: one object contains or refers
to another object.

ONE GOOD SOLUTION
public class Customer
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
}

public class Policy
{
    public int Id { get; set; }
    public string PolicyNumber { get; set; } = "";
    public string Status { get; set; } = "";
    public decimal Premium { get; set; }
    public Customer Customer { get; set; } = new Customer();
}

WHY THESE TYPES?
- int is reasonable for the sample IDs.
- string fits names, email addresses, policy numbers, and the simple status.
- decimal is normally preferred over double for money.
- Customer connects the two objects and keeps customer details together.

HOW TO GRADE (0-3)
3 — Creates both classes, places fields on the appropriate class, uses sensible
    types, and connects Policy to Customer.
2 — Creates both classes with most fields but misses the relationship or makes
    a small type/syntax mistake.
1 — Creates only one large class or needs substantial help separating the data.
0 — Cannot translate the described information into C# classes and properties.

ACCEPTABLE VARIATIONS
- Fields instead of properties are acceptable for this short exercise, although
  properties are conventional in C# application models.
- CustomerId on Policy is a reasonable database-oriented answer. Ask how the
  code would access the customer's name; adding Customer as well is stronger.
- An enum for Status is a good enhancement but is not required.
- Constructors are optional. Auto-properties are enough for full credit.

HOW THIS CONNECTS TO LATER QUESTIONS
The later SQL, MVC, Entity Framework, LINQ, and SOLID exercises build on these
same Customer and Policy ideas. The candidate does not need every production
field yet; this is only the starting model.`
    },

    'ai-prompting': {
      title: 'AI Prompting — Describe a .NET Change',
      language: 'markdown',
      content: `# 5-minute AI prompting question

## Scenario

You are working on an existing ASP.NET Core MVC insurance application that uses
Entity Framework Core and SQL Server.

The Policies Index page already lists every policy. The product owner asks you
to add a search box so users can find policies by customer name.

The requested behavior is:

- Add a customer-name search box to the existing Policies Index page.
- An empty search should show every policy.
- A non-empty search should show policies whose CustomerName contains the text.
- Filter in the database with Entity Framework rather than loading every row
  into memory first.
- Keep the user's search text visible in the box after submitting.
- Add tests for an empty search and a matching search.
- Do not change unrelated application behavior.

## Your task

Write the prompt you would give an AI coding assistant to implement this change.

There is no single exact answer. Your prompt should give the AI enough context
to make a useful change and explain how you would check its work.

Write your AI prompt below:

`,
      answerKey: `WHAT THIS QUESTION TESTS
This is not a test of finding magic words. A good developer treats an AI like a
new teammate: provide context, describe the desired behavior, set boundaries,
request verification, and review the result instead of trusting it blindly.

ONE STRONG EXAMPLE PROMPT
We have an existing ASP.NET Core MVC application using Entity Framework Core
and SQL Server. Please inspect the current Policy model, PoliciesController,
Policies/Index.cshtml view, DbContext, and existing test conventions before
editing anything.

Add customer-name search to the existing Policies Index page:
- Add a GET search input named customerName to the Razor view.
- Accept the optional value in the Index action.
- If it is blank, return all policies.
- Otherwise, filter by CustomerName in the IQueryable before ToListAsync so
  SQL Server performs the filtering.
- Preserve the entered value in the search box after submission.
- Follow the project's existing naming and styling patterns.
- Do not modify unrelated files or add a migration unless the model changes.
- Add tests for a blank search and a matching search.

Before editing, tell me which files you expect to change and ask about anything
the repository does not make clear. After editing, summarize the changes and
run the relevant build and tests. Show me any failures instead of hiding them.

WHY THIS IS STRONG
- It identifies the technology and asks the AI to inspect the real project.
- It translates the request into specific, observable behavior.
- It prevents an inefficient in-memory filter.
- It limits unrelated changes and unnecessary migrations.
- It asks for tests, build verification, and honest reporting of failures.

HOW TO GRADE (0-3)
3 — Includes project context, clear requirements, important constraints, and a
    request to test or verify the work.
2 — Describes the feature clearly but misses either technical context,
    boundaries, or verification.
1 — Gives a vague request such as "add search" with little useful detail.
0 — Provides no workable prompt or expects the AI output to be trusted without
    review.

GOOD FOLLOW-UP QUESTION
Ask: "What would you personally check before accepting the AI's code?"

Good answers include reviewing the diff, checking that filtering happens before
ToListAsync, running tests, trying empty and matching searches, checking error
handling, and confirming unrelated files were not changed.

INTERVIEWER TIP
Do not grade grammar or prompt length. A shorter prompt can earn full credit if
it communicates the context, desired outcome, constraints, and verification.`
    },

    'frontend-css': {
      title: 'HTML/CSS — Responsive Policy Card',
      language: 'html',
      content: `<!-- 5-minute HTML/CSS question

The HTML below displays a policy summary. The existing CSS makes the card too
wide, gives the content no breathing room, and has no visible border.

Update only the CSS to:
1. Let the card use the available width but never exceed 400px.
2. Add 16px of space inside the card.
3. Add a 1px solid gray border and 8px rounded corners.
4. On screens 480px wide or smaller, make the button fill the card width.
-->

<style>
    /* Existing CSS — edit this */
    .policy-card {
        width: 700px;
        padding: 0;
        border: none;
    }

    .details-button {
        width: auto;
    }

    /* Add the mobile rule here */
</style>

<!-- Existing HTML — do not change -->
<article class="policy-card">
    <h2>Policy AUTO-1001</h2>
    <p>Customer: Alice Johnson</p>
    <p>Status: Active</p>
    <button class="details-button">View details</button>
</article>`,
      answerKey: `PLAIN-ENGLISH ANSWER
width: 100% lets the card shrink to fit its container. max-width: 400px stops
it from becoming wider than 400px on a large screen. Padding adds space inside
the border. The media query changes the button only on small screens.

ONE GOOD SOLUTION
.policy-card {
    width: 100%;
    max-width: 400px;
    padding: 16px;
    border: 1px solid gray;
    border-radius: 8px;
    box-sizing: border-box;
}

.details-button {
    width: auto;
}

@media (max-width: 480px) {
    .details-button {
        width: 100%;
    }
}

WHY BOX-SIZING HELPS
With box-sizing: border-box, the declared width includes the padding and border.
Without it, a width: 100% element can become slightly wider than its container.
Treat this as a useful bonus, not a requirement unless overflow occurs.

HOW TO GRADE (0-3)
3 — Adds responsive width/max-width, padding, border, rounded corners, and the
    mobile button rule.
2 — Completes most changes but misses one detail or makes a minor syntax error.
1 — Can add basic padding or border but cannot make the card responsive.
0 — Does not know which CSS properties control these visible changes.

ACCEPTABLE VARIATIONS
- Colors such as #999, #ccc, or another reasonable gray are fine.
- A close breakpoint such as 500px is fine if the candidate explains it.
- Equivalent selectors and reasonable pixel/rem values are fine.

OPTIONAL FOLLOW-UP
Ask the candidate to explain the difference between margin and padding:
padding is inside the element's border; margin is outside the border.`
    },

    'dotnet-interview-plan': {
      title: 'Your .NET Interview',
      language: 'markdown',
      content: `# Welcome to your .NET interview

You will work through ten short exercises. Each one is intended to take about
five minutes. The goal is to understand how you approach a problem—not to test
whether you have memorized every piece of syntax.

## What we will cover

1. C# — Insurance premium warm-up
2. C# — Model Customers and Policies
3. SQL Server — Simple Join
4. LINQ — Simple Filter
5. Entity Framework — Add a Field and Migration
6. ASP.NET MVC — Validation
7. C# — REST API Basics
8. SOLID — Constructor Injection
9. AI — Prompt a Coding Assistant
10. HTML/CSS — Responsive Policy Card

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

Suggested total for 10 questions: 30 points
27–30 — Strong performance
20–26 — Reasonable performance; discuss weak areas
12–19 — Significant gaps; consider experience claims carefully
0–11  — Fundamentals were not demonstrated

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
