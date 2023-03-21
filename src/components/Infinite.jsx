import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

import * as S from "./infiniteStyle";

const API_KEY = "abc403579672041cca0a614a073d82a1";
const URL = "https://api.themoviedb.org/3/movie/popular";

function Infinite() {
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

  // 옵저버 생성하기
  // https://developer.mozilla.org/ko/docs/Web/API/Intersection_Observer_API
  //  let observer = new IntersectionObserver(callback, options);

  // threshold 대상 요소 (observer) 가 지정된 위치에서 0.5 %만 보여도 콜백이 호출됨
  useEffect(() => {
    const observer = new IntersectionObserver(observerHandler, {
      threshold: 0.5,
    });
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    return () => {
      // 옵저버 중복을 방지하기 위해서 연결을 끊어줌
      observer.disconnect();
    };
  }, []);

  // 옵저버 콜백함수 생성
  // entries(배열) => 감지한 DOM 요소들의 인터섹션 상태 정보가 담긴다
  // entries = IntersectionObserverEntry
  const observerHandler = (entries) => {
    // console.log(entries);
    const target = entries[0];
    // console.log(target);
    // console.log(target);
    // console.log(preventObserverRef);
    if (
      !endRef.current &&
      target.isIntersecting &&
      preventObserverRef.current
    ) {
      preventObserverRef.current = false;
      setPage((prev) => prev + 1);
    }
  };
  console.log(page);
  // 사진 받아오기 => Effect 로 재 랜더링 됐을때를 대비해서 Callback 사용
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
      // 5페이지가 마지막이라고 가정함
      if (page === 5) {
        endRef.current = true;
      }
      setData((prev) => [...prev, ...movies]);
      // 여기 체크해주는 것 잊지 말것
      preventObserverRef.current = true;
    } catch (error) {
      console.log(console.error());
    }
    setLoad(false);
  }, [page]);

  // 처음에 사진 가져오게 하기 위함
  useEffect(() => {
    getMovieData();
  }, [getMovieData]);
  return (
    <div className="App">
      <p>무한스크롤 테스트하기</p>
      <div>
        {data.map((d) => (
          <div key={d.id}>
            <S.CatImg
              src={`https://image.tmdb.org/t/p/w500${d.poster}`}
              alt=""
            />
            <p>{d.title}</p>
          </div>
        ))}
      </div>
      {load ? <div>로딩중</div> : <div></div>}
      {endRef.current ? (
        <p>마지막 페이지 입니다</p>
      ) : (
        <p ref={observerRef}> 옵저버 체크증</p>
      )}
    </div>
  );
}

export default Infinite;
