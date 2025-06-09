# github
```
git init
```
```
git add .
```
```
git commit -m "first commit"
```
```
git remote add origin https://github.com/vmartinez1984/peliculas_front.git
```
```
git push master
```

# Deploy in github
```
ng build --base-href "https://vmartinez1984.github.io/Peliculas02.Angular/"
```
install if you dont have intall
```
npm install -g angular-cli-ghpages
```
```
npx angular-cli-ghpages --dir=dist/peliculas_angular/browser
```
