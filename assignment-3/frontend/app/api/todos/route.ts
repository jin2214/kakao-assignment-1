import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const res = await fetch(`${process.env.FASTAPI_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json();
    return NextResponse.json(
      { detail: error.detail ?? "할 일 생성에 실패했습니다" },
      { status: res.status },
    );
  }

  const data = await res.json();
  revalidateTag("todos-list", "max");
  return NextResponse.json(data, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const { id, ...updateFields } = await request.json();

  const res = await fetch(`${process.env.FASTAPI_URL}/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateFields),
  });

  if (!res.ok) {
    const error = await res.json();
    return NextResponse.json({ detail: error.detail }, { status: res.status });
  }

  const data = await res.json();
  revalidateTag("todos-list", "max");
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  const res = await fetch(`${process.env.FASTAPI_URL}/todos/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    return NextResponse.json(
      { detail: "할 일 삭제에 실패했습니다" },
      { status: res.status },
    );
  }

  revalidateTag("todos-list", "max");
  return new NextResponse(null, { status: 204 });
}
