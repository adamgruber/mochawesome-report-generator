<!doctype html>
<html lang='en'>
  <head>
    <meta charset='utf-8' />
    <meta http-equiv='X-UA-Compatible' content='IE=edge' />
    <meta name='viewport' content='width=device-width, initial-scale=1' />
    <title>Mochawesome Report Card</title>
    {{#inlineAssets}}<style>{{{inlineAsset 'styles'}}}</style>{{/inlineAssets}}
    {{^inlineAssets}}<link rel="stylesheet" href="css/mochawesome.css">{{/inlineAssets}}
  </head>
  <body data-raw='{{raw}}' data-config='{{config}}'>
    <div id='report'></div>
    <!-- Scripts -->
    {{#inlineAssets}}
    <script type='text/javascript'>{{{inlineAsset 'scripts'}}}</script>
    {{/inlineAssets}}
    {{^inlineAssets}}
    <script src='js/app.js'></script>
    {{/inlineAssets}}
  </body>
</html>
