# Template

This is a template for creating a new Next.js + MF sample.

## Deploy to Zephyr Cloud

Click the button below to deploy this sample to Zephyr Cloud.

<!-- TODO: replace the badge button below with Deploy to Zephyr Button -->

![npm](https://img.shields.io/npm/dw/@module-federation/nextjs-mf)

## Sample Structure

```
- template
  ├ host            (A nextjs@13+ host app)
  ├ remote          (A nextjs@13+ remote app)
  ├ package.json    (Package file with scripts to run all apps at once)
  └ README.md       (This readme file to explain how to run the sample and deploy it using Zephyr)
```

## Sample Stack

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## How to run the sample

To run the sample in development mode, run the following command:

```bash
npm run dev
```

To run the sample in production mode, first build the sample using the following command:

```bash
npm run build
```

Then, run the following command to serve the sample:

```bash
npm run start
```
