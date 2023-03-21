# 무한스크롤 연습 프로젝트

### 블로그 포스팅 주소 : https://bannabanana.tistory.com/163

### 작동 방식
1. 데이터를 불러온다
2. 화면 최 하단부 or (다음 데이터를 불러올 위치) 에 이동한다
3. 다음 데이터를 불러온다
4. 불러올 데이터가 없으면 종료한다 (API 에서 마지막 페이지)

### 구현에 사용한 것
1. Intersection 옵저버
2. 페이지 처리가 된 api
3. TMDB API

### 구현에 사용한 State & Ref
- State
  - 데이터를 저장할 수 있는 State
  - 데이터 로딩을 체크할 수 있는 State
  - API 페이지 처리를 할 수 있는 State
- Ref
  - 옵저버를 체크할 Ref
  - 중복 생성을 방지하는 Ref
  - 마지막 페이지를 체크할 수 있는 Ref

```javascript
// 받아온 데이터를 저장할 위치
const [data, setData] = useState([]);
// 로딩중인지 체크
const [load, setLoad] = useState(null);
// 페이지 체크 => useEffect 실행을 위함
const [page, setPage] = useState(0);
// 옵저버 엘리먼트
const observerRef = useRef(true);
// 옵저버 중복생성 방지
const preventObserverRef = useRef(true);
// 마지막 페이지 체크
const endRef = useRef(false);
```

### 구현에 사용한 함수
1. 데이터를 불러올 수 있는 함수
```javascript
const getMovieData = useCallback(async () => {
    setLoad(true);
    try {
      const MovieDatas = await axios({
        url: `${URL}?api_key=${API_KEY}&page=${page}`,
      });
      // console.log(MovieDatas.data.results);
      const movies = MovieDatas.data.results.map((movie) => {
        return {
          id: movie.id,
          title: movie.title,
          poster: movie.poster_path,
        };
      });
      setData((prev) => [...prev, ...movies]);
    } catch (error) {
      console.log(console.error());
    }
    setLoad(true);
  }, [page]);
```

2. 옵저버 콜백 함수
```javascript
const observerHandler = (entries) => {
    const target = entries[0];
    if (
      // !endRef.current &&
      target.isIntersecting &&
      preventObserverRef.current
    ) {
      console.log(preventObserverRef);
      preventObserverRef.current = false;
      setPage((prev) => prev + 1);
    }
  };
```
