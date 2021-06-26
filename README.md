# Effective Lawyer Finder

A live demo of the app can be found [here](https://lawyers-finder.herokuapp.com/).

## Prerequisites

* [Docker](https://www.docker.com/)

---

## Setting up

1. Set up your environment variables

  ```bash
  cp .env.example .env
  ```

2. Install the dependencies

  ```bash
  npm i
  ```

3. Start the `postgres` container:


  ```bash
  # The corresponding values for `<...>` are found in the `.env` file
  docker run --rm --name lawyer-postgres -p 5432:5432 \
  -e POSTGRES_PASSWORD=<...> \
  -e POSTGRES_USER=<...> \
  -e POSTGRES_DB=<...> \
  -v "$PWD/db/":/docker-entrypoint-initdb.d/ postgres
```

4. Start the server and watch the `style.scss` file:

  ```bash
  npm run dev
   ```

**Note**: if this is the first time you're running `npm run dev`, you might want to do a `CTRL + S` in the `style.scss` file so that the `css/` directory will be created.


---

## Useful links

* [Documentation](https://docs.google.com/document/d/1zd0phI7jGdtmJvWWq777okt7BKjt3QUyxmUIgtPkPbY/edit#).