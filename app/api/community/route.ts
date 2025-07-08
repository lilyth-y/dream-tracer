// /app/api/community/route.ts
// 데모 모드: 메모리 내 임시 데이터, 실제 배포 시 DB 연동
let DEMO_POSTS = [
  {
    id: "1",
    author: "익명1",
    content: "하늘을 나는 꿈을 꿨어요! 너무 자유로웠어요.",
    likes: 3,
    comments: [
      { id: "c1", author: "익명2", text: "저도 비슷한 꿈 꾼 적 있어요!" }
    ],
    createdAt: new Date().toISOString(),
  },
]
export async function GET() {
  return Response.json({ posts: DEMO_POSTS })
}
export async function POST(request: Request) {
  const { content, author } = await request.json()
  const newPost = {
    id: Date.now().toString(),
    author: author || "익명",
    content,
    likes: 0,
    comments: [],
    createdAt: new Date().toISOString(),
  }
  DEMO_POSTS = [newPost, ...DEMO_POSTS]
  return Response.json({ post: newPost })
}
export async function PUT(request: Request) {
  const { postId, comment, like } = await request.json()
  DEMO_POSTS = DEMO_POSTS.map((p) =>
    p.id === postId
      ? {
          ...p,
          comments: comment
            ? [...p.comments, { id: Date.now().toString(), author: "익명", text: comment }]
            : p.comments,
          likes: like ? p.likes + 1 : p.likes,
        }
      : p
  )
  return Response.json({ ok: true })
}
