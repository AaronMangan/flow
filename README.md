# Flow - Next Generation Document Management

<quote>*Flow is a next-gen document management system, that allows you to keep track of all your project/s documentation and control it's versions!*</quote>

**Why?**

### *Why are documents "controlled"?*

At it's most basic level, documents are controlled when it is important to know that you have the latest version (revision). This becomes particularly relevant in an engineering environment because when an entity is building something, either physically or in design, it is common for changes to take place (for a myriad of reasons).

When a change is made the recipients of the original document need to be made aware of the new revision so that they can action it accordingly.

Changes in documents can also have other effects:

- Variations: If a document was used as a basis to price something and it changes, it's fair to say that the price may also change. This is known as a variation.
- Capacity: When changed, the capacity of the recipient to perform an action based off the document may also change.
- Specification: Changes to a document may change the applied specification (particularly in engineering fields) and therefore, how it is built, priced, etc.
- Quality Control & Safety: Sometimes changes are made to ensure safety and compliance, or to ensure a better quality product.

**Example:**

Let's imagine you are having a cabinet built for your home and you sketch up a design. You then send a copy of the sketch to a cabinet maker and ask for a quote.

They reply back to you with a price and you agree - Great! You tell them to proceed and are told that it will be completed in about 2 weeks. Two days later, you decide you want to change the height of the cabinet and re-do the sketch, send it off to the cabinet makers and get a new quote back for the latest design.

From the cabinet makers point of view, there are now two sketches of the cabinet - how do they know which one is the correct one to work from? The answer is revisions! The first sketch was revision `A` and the second sketch was revision `B`. 
The cabinet maker can log into the system and check that `B` is latest version of the sketch and therefore, the correct one, meaning you get the right cabinet made.

This is the fundamental principle of document control, ensuring that changes in documents are communicated effectively to anyone who received it previously.

Our example was very simple, but imagine a government building, or power plant or even a pipeline being built with thousands of drawings, specifications and schedules. It would be impossible to track what is current without a system like flow.

**So, Why Document Numbers?**

Another feature of document control is that all documents receive a "document number". This performs two critical functions:

1. Acts as a universal reference to a document, which does not change over time - unlike the title, which may be changed.
2. Lets the reader know exactly what kind of document it is without having to read through and understand it.

Lets look at an example: If a company or entity has a numbering system like:

Area - Discipline - Type - Index

Then:

`AUS-MEC-REP-000001` - Australian East - West Pipeline - Pumping Station Condition Report - 2025

Represents:

 **AUS** Area, in this case we've used `AUS` for Australia

**MEC** Discipline, where `MEC` is the code for Mechanical

**REP** Because the document is a report, and `REP` is the code for reports

**000001** Is the index, meaning that this is the first document with the AUS-MEC-REP combination of identifiers (metadata). The next document with that combination will be *000002* making each number unique.

If another document for another discipline or type were produced for the same area, it's document number may look like:

`AUS-ELE-DRW-000001` 

and it's title: Australian East - West Pipeline Electrical Supply Diagram - Zone 1 may change with each revision, but its number will not. The next document the sequence may be something like:

`AUS-ELE-DRW-000002 - Australian East - West Pipeline Electrical Supply Diagram - Zone 2`

and so on.

## Installation

Installing Flow is not unlike any other Laravel / React application. Once you have cloned the repo, follow these steps:

`cp .env.example .env` to create an env file. Note that sensitive information such as tokens and API keys should not be committed to any repository.

`composer install` to install the necessary backend packages.

`npm install` to install the necessary frontend packages

`php artisan key:generate` to create the application key.

Now, update the `.env` file with the details of your database, mail provider, etc. Don't forget to add details for admin accounts

Run `php artisan db:seed` to create the Super Admin account.

`npm run build` to build the front end assets.

## Getting Started

Once installed, you may begin setting up Flow. Start by adding metadata in each of the following fields

**Revisions**

Add the revisions that are used by your organisation.

- **Name:** This field allows you to name the revision, to make it easier to understand its use. (e.g. Revision A)
- **Code:** The code for the revision (e.g. A) - This is typically what is shown one the document.
- **Description:** You can optionally add some details about the revision here, like why it is used or when it is appropriate to use it.

**Statuses**

Document statuses are generally indicative of their intended use, a common example is Issued For Construction (IFC) and documents with this status will be transmitted to another party, who will use the document to construct (build) something. This is typical of engineering drawings, but useful for any document to inform the reader about the current state of the document.

- **Name:** The name of the status, to help explain it. (i.e. Issued For Construction)
- **Code:** Code that is shown on the documents (i.e. IFC)
- **Draft:** Select yes if this status is only applicable to draft documents, like Issued For Review (IFR). This helps the system know when it is appropriate to transmit a document.
- **Description:** Details about what the status is used for or when it should be selected, or what documents it applies to.

You are not limited to engineering or construction statuses for your documentation - in fact you can make whatever statuses you like and apply them to the document.

**Disciplines**

Disciplines are used to group documents together by the department or function they belong to. In an engineering environment this could be Mechanical, Chemical, Electrical, etc.

- **Name:** The discipline name, used to clarify which group the document belongs to.
- **Code:** Discipline code, which is used when generating document numbers.
- **Description:** Details of what make a document relevant to this discipline.

**Types**

These are used to further group the documents on a project or scope into the kind of document it is. Some examples include, `Reports`, `Lists`, `Drawings`, `Plans`, etc.

- **Name:** The name for the type of document
- **Code:** A code representing the type. Typically used in document numbering.
- **Description:** Information about what makes a document fit this type.

**Areas**

Areas are also used to group documents, typically by geographical area, or by project, etc.

- **Name:** The name for the area (Project, location, etc)
- **Code:** A code representing the area. Typically used in document numbering.
- **Description:** Details of what makes a document fit into this area, its location or project.

**Config**

Some options are customizable in Flow. Below is an explanation of which options can be made changed.

`tags` - Set this to `true` of you want the ability to add tags to documents. Tags can be used for a number of different reasons. If any value other than true is set it will be considered as `false` and will not be present.

`areas` - Set to `true` if you want to be able to group documents by area. If any value other than true is set it will be considered as `false` and will not be present.

`types` - Set to true to group documents by types, Report, Drawing, etc. If any value other than true is set it will be considered as `false` and will not be present.

`email_from` - Allows you to set a static email address where all emails generated by the system are set as from. any replies to an email will be sent to this address and it typically recommended to use a group mailbox.

`disciplines` Set to true if you'd like to use disciplines to group your documents by and include them in document numbering.

`document_number_schema` Define what the document number will look like using placeholders. See the relevant section the documentation for more details.

`transmittal_email_limit` Define a limit to the number of documents **SHOWN** on a transmittal email (only). Please note that this is not a hard limit on the number of documents, just a limit to the amount of documents that are displayed in the transmittal email (to help prevent oversize emails) - *When a recipient clicks the **View Transmittal** button, they will be taken to the page where they can see all the documents that are on that transmittal* - Defaults to `50`

`transmittal_expiry_days` Sets a number of days after which the transmittal can no longer be viewed using the link. Defaults to `21 days` (3 weeks)

`document_number_separator` Define what character to use as a separator in the document numbering schema. Defaults to `-`

`document_number_index_format` Describe using a regular expression, what the index portion of the document number should be. in the example below, it is 5 digits (00001, 00002, 00099, etc)

```json
{
    "tags": true,
    "areas": true,
    "types": true,
    "email_from": "doccontrol@flow.com.au",
    "disciplines": true,
    "document_number_schema": "{area}{separator}{discipline}{separator}{type}{separator}{index}",
    "transmittal_email_limit": 50,
    "transmittal_expiry_days": 21,
    "document_number_separator": "-",
    "document_number_index_format": "/\\d{5}$/"
}
```

## Document Numbering

Every organisation or team handles document number differently, but the principle is the same. Each document should be assigned a unique identifier that allows for quick identification of a document.

This works because trying to identify a document by its title or other properties is not always accurate, as these may change over time. It also tells the reader some information about the document without needing to read and/or understand it.

There are many examples of document numbering , but, in general the document metadata is used to put together a unique identifier. In **Flow** you can specify how you want the document number to be made by defining it in the config for the organisation.

### Metadata Placeholders

Metadata placeholders are used to determine how a document number should be made. A placeholder is a `key` wrapped in braces `{}`. For example `{area}`. There are also several special placeholders such as `{separator}` - which is used to separate the elements of the document number.

If your organisation uses a `-` separator, and your document numbering scheme is defined as `{area}{separator}{discipline}{separator}{type}{separator}{index}` and you have:

An `area` of **SGF** for Southern Gas Field
A `discipline` of **MEC** for Mechanical
A type of **REP** for Report
The `index` will be computed by flow at the time the document number is created. For example, lets use `00099`
The separator is defined as a `-`

Then, the resulting document number would be `SGF-MEC-REP-00099`

## Grouping
Keep in mind that the metadata can be used in whichever way suits you, your team or organisation. Disciplines aren't limited to engineering disciplines but can be any groupings you can think of. This is the same for Areas and Types as well. Think of them as three different ways in which you may group and sort documents.


## Tags

Another feature of Flow is tagging. Tagging helps you categorize documents by applying labels. These can make searching for, and finding, relevant documentation a lot easier. You are free to define and apply tags in whatever manner you believe will benefit you or your team.