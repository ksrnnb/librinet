import React from 'react';
import ReactDOM from 'react-dom';
const axios = window.axios;

function Subtitle() {
  return <h2>User Profile</h2>;
}

function UserImage(props) {
  if (props.user.image) {
    return <img className="img-fluid" src={props.user.image} alt="user-image" />
  } else {
    return <img className="img-fluid" src='/img/icon.svg' alt="user-image" />
  }
}

function EditButton(props) {
  const user = props.user;
  const authStrId = props.authStrId;

  let EditButton;
  // 表示しているユーザーと、閲覧者が異なる場合は編集ボタン非表示
  if (user.str_id !== authStrId) {
    EditButton = null;

  // 表示しているユーザーが、閲覧者自身の場合
  } else {
    // ゲストの場合
    if (user.str_id === 'guest') {
      EditButton = (
            <>
              <button type="button" className="btn btn-outline-success invalid">
                ユーザー情報を編集する
              </button>
              <p className="text-danger">
                注意：ゲストユーザーは編集できません
              </p>
            </>
      );
    // ゲスト以外の場合
    } else {
      EditButton = (
            <a href={'/user/edit/' + user.str_id}>
              <button type="button" className="btn btn-outline-success">ユーザー情報を編集する</button>
            </a>
      );
    }
  }

  return EditButton;

}

export default class Profile extends React.Component {

  constructor(props) {
    super(props);
    // this.strId = this.props.match.params.strId;
    // const url ='/api/user/' + this.strId;

    // axios.get(url)
    // .then(response => {
    //   // console.log(response.data);
    // })
    // .catch(error => {
    //   // console.log(error);
    // });
  }
  
  render() {
    // const strId = this.props.match.params.strId;
    const user = this.props.location.state.user;
    const authStrId = this.props.location.state.authStrId;


    
    // followボタンは後で実装
    const FollowButton = null;
    //           <!-- フォロー表示 -->
    //               <div id="follower-react"></div>
    //                   <input type="hidden" id="follow_id" name="follow_id" value="{{$user->id}}">
    //                   <input type="hidden" id="follower_id" name="follower_id" value="{{Auth::id()}}">
    //                   <input type="hidden" id="is_following" value="{{$is_following}}">
    //                   <!-- TODO: ここは認証済みの場合のみ -->


    // follow人数も後で


  //       <div class="col-10">
  //          
  //           
  //       </div>
  //   </div>

  //   <div class="row follow">
  //       <div class="col-12">
  //           <?php $follow_url   = '/user/follows/' . $user->str_id;
  //                 $follower_url = '/user/followers/' . $user->str_id; ?>

  //           <a id="follow-link" href="{{$follow_url}}">
  //               <p id="follow" data-count="{{$follows}}">フォロー: {{$follows}}</p>
  //           </a>
  //           <a id="follower-link" href="{{$follower_url}}">
  //               <p id="follower" data-count="{{$followers}}">フォロワー: {{$followers}}</p>
  //           </a>
  //       </div>
  //   </div>


    return (
            <>
            <Subtitle />
            <div className="row">
              <div className="col-2">
                <UserImage user={user} />
              </div>
              <div className="col-10">
                <p className="h4">{user.name}</p>
                 <p className="h5">{'@' + user.str_id}</p>
                <EditButton user={user} authStrId={authStrId} />
                {FollowButton}
              </div>
            </div>
            </>
    );
  }


  //   <div class="row mt-5">
  //       <div class="col-6">
  //           <h2>本棚</h2>
  //       </div>
        
  //       <!-- 編集機能 -->
  //       @if ($user->id == $auth_id)
  //           @if ($genres_books->isNotEmpty())
  //               <div class="col-6">

  //                   <a href="{{'/book/edit/' . $user->str_id}}">
  //                       <button type="submit" class="btn btn-outline-success">ジャンルを編集する</button>
  //                   </a>
  //                   <a href="{{'/book/delete/' . $user->str_id}}">
  //                       <button type="submit" class="btn btn-outline-danger">本を削除する</button>
  //                   </a>
  //               </div>
  //           @endif
  //       @endif
  //   </div>
  //   <div class="row book-shelf">
  //       <div class="col-12">
  //           @if($genres_books->isEmpty())
  //           <!-- TODO: これは自分しか見えないように -->
  //               <p class="text-danger">本棚に本がありません</p>
  //               <p>本棚に本を追加しましょう！</p>
  //               <a href="/book">
  //                   <button type="button" class="btn btn-outline-success">
  //                       本を探す
  //                   </button>
  //               </a>
  //           @else
  //               @foreach($genres_books as $genre_id => $books)
  //                   <p class="h2 mt-2">{{$genres[$genre_id]}}</p>
  //                   @foreach($books->chunk(4) as $chunk)
  //                       <div class="row mt-3">
  //                           @foreach($chunk as $book)
  //                               <?php $book_url = '/book/show/' . $book->isbn ?>
  //                               <div class="col-3">
  //                                   <a href="{{$book_url}}">
  //                                       @if (isset($book->cover))
  //                                           <img class="img-fluid w-100" src="{{$book->cover}}" alt="book-cover">
  //                                       @else
  //                                           <img class="img-fluid w-100" src="{{asset('img/book.svg')}}" alt="book-cover">
  //                                       @endif
  //                                   </a>
  //                               </div>
  //                           @endforeach
  //                       </div>
  //                       <div class="row mt-2">
  //                           @foreach($chunk as $book)
  //                           <div class="col-3">
  //                               <p>{{$book->title}}</p>
  //                           </div>
  //                           @endforeach
  //                       </div>
  //                   @endforeach
  //               @endforeach
  //           @endif
  //       </div>
  //   </div>
}

