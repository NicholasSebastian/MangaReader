# monokuro

## To Do List

- Offline mode
  - On app start, check for internet connection.
  - If offline:
    - Default the user to the downloads page.
    - Show 'no internet connection' message on every page except the downloads page.
  - Else:
    - Try to fetch the initial data.
    - If fail:
      - Default the user to the downloads page.
      - Show 'internal server is down' message on every page except the downloads page.
    - Else:
      - Proceed normally.
