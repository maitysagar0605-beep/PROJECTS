import sys
import pygame

pygame.init()

WIDTH, HEIGHT = 800, 800
SQUARE_SIZE = WIDTH // 8

WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
BROWN = (139, 69, 19)
YELLOW = (255, 255, 0)

screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Chess Game")


class ChessPiece:

  def __init__(self, color, piece_type, image_path):
    self.color = color
    self.type = piece_type
    self.image = pygame.image.load(image_path)
    self.image = pygame.transform.scale(self.image, (SQUARE_SIZE, SQUARE_SIZE))
    self.has_moved = False


# Global Game State
board = [[None for _ in range(8)] for _ in range(8)]
current_player = "white"
selected_piece = None
selected_pos = None


def initialize_board():
  global board
  board = [[None for _ in range(8)] for _ in range(8)]

  # Pawns
  for i in range(8):
    board[1][i] = ChessPiece("black", "pawn", "images/black_pawn.png")
    board[6][i] = ChessPiece("white", "pawn", "images/white_pawn.png")

  # Rooks
  board[0][0] = ChessPiece("black", "rook", "images/black_rook.png")
  board[0][7] = ChessPiece("black", "rook", "images/black_rook.png")
  board[7][0] = ChessPiece("white", "rook", "images/white_rook.png")
  board[7][7] = ChessPiece("white", "rook", "images/white_rook.png")

  # Knights
  board[0][1] = ChessPiece("black", "knight", "images/black_knight.png")
  board[0][6] = ChessPiece("black", "knight", "images/black_knight.png")
  board[7][1] = ChessPiece("white", "knight", "images/white_knight.png")
  board[7][6] = ChessPiece("white", "knight", "images/white_knight.png")

  # Bishops
  board[0][2] = ChessPiece("black", "bishop", "images/black_bishop.png")
  board[0][5] = ChessPiece("black", "bishop", "images/black_bishop.png")
  board[7][2] = ChessPiece("white", "bishop", "images/white_bishop.png")
  board[7][5] = ChessPiece("white", "bishop", "images/white_bishop.png")

  # Queens
  board[0][3] = ChessPiece("black", "queen", "images/black_queen.png")
  board[7][3] = ChessPiece("white", "queen", "images/white_queen.png")

  # Kings
  board[0][4] = ChessPiece("black", "king", "images/black_king.png")
  board[7][4] = ChessPiece("white", "king", "images/white_king.png")


def draw_board():
  for row in range(8):
    for col in range(8):
      color = WHITE if (row + col) % 2 == 0 else BROWN
      pygame.draw.rect(
          screen,
          color,
          (col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE),
      )

  if selected_pos:
    pygame.draw.rect(
        screen,
        YELLOW,
        (
            selected_pos[1] * SQUARE_SIZE,
            selected_pos[0] * SQUARE_SIZE,
            SQUARE_SIZE,
            SQUARE_SIZE,
        ),
    )


def draw_pieces():
  for row in range(8):
    for col in range(8):
      piece = board[row][col]
      if piece:
        screen.blit(piece.image, (col * SQUARE_SIZE, row * SQUARE_SIZE))


def get_valid_moves(piece, row, col):
  moves = []

  if piece.type == "pawn":
    direction = -1 if piece.color == "white" else 1

    # Move forward 1 step
    if (
        0 <= row + direction < 8
        and board[row + direction][col] is None
    ):
      moves.append((row + direction, col))
      # Move forward 2 steps on initial move
      if (
          not piece.has_moved
          and 0 <= row + 2 * direction < 8
          and board[row + 2 * direction][col] is None
      ):
        moves.append((row + 2 * direction, col))

    # Diagonal captures
    for dc in [-1, 1]:
      if 0 <= col + dc < 8 and 0 <= row + direction < 8:
        target_piece = board[row + direction][col + dc]
        if target_piece and target_piece.color != piece.color:
          moves.append((row + direction, col + dc))

  elif piece.type == "rook":
    for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
      r, c = row + dr, col + dc
      while 0 <= r < 8 and 0 <= c < 8:
        if board[r][c] is None:
          moves.append((r, c))
        elif board[r][c].color != piece.color:
          moves.append((r, c))
          break
        else:
          break
        r += dr
        c += dc

  elif piece.type == "knight":
    knight_moves = [
        (-2, -1),
        (-2, 1),
        (-1, -2),
        (-1, 2),
        (1, -2),
        (1, 2),
        (2, -1),
        (2, 1),
    ]
    for dr, dc in knight_moves:
      r, c = row + dr, col + dc
      if 0 <= r < 8 and 0 <= c < 8:
        if board[r][c] is None or board[r][c].color != piece.color:
          moves.append((r, c))

  elif piece.type == "bishop":
    for dr, dc in [(-1, -1), (-1, 1), (1, -1), (1, 1)]:
      r, c = row + dr, col + dc
      while 0 <= r < 8 and 0 <= c < 8:
        if board[r][c] is None:
          moves.append((r, c))
        elif board[r][c].color != piece.color:
          moves.append((r, c))
          break
        else:
          break
        r += dr
        c += dc

  elif piece.type == "queen":
    queen_directions = [
        (-1, 0),
        (1, 0),
        (0, -1),
        (0, 1),
        (-1, -1),
        (-1, 1),
        (1, -1),
        (1, 1),
    ]
    for dr, dc in queen_directions:
      r, c = row + dr, col + dc
      while 0 <= r < 8 and 0 <= c < 8:
        if board[r][c] is None:
          moves.append((r, c))
        elif board[r][c].color != piece.color:
          moves.append((r, c))
          break
        else:
          break
        r += dr
        c += dc

  elif piece.type == "king":
    king_moves = [
        (-1, -1),
        (-1, 0),
        (-1, 1),
        (0, -1),
        (0, 1),
        (1, -1),
        (1, 0),
        (1, 1),
    ]
    for dr, dc in king_moves:
      r, c = row + dr, col + dc
      if 0 <= r < 8 and 0 <= c < 8:
        if board[r][c] is None or board[r][c].color != piece.color:
          moves.append((r, c))

  return moves


def is_check(color):
  king_pos = None
  for r in range(8):
    for c in range(8):
      piece = board[r][c]
      if piece and piece.type == "king" and piece.color == color:
        king_pos = (r, c)
        break
    if king_pos:
      break

  if not king_pos:
    return False

  opponent_color = "black" if color == "white" else "white"
  for r in range(8):
    for c in range(8):
      piece = board[r][c]
      if piece and piece.color == opponent_color:
        valid_moves = get_valid_moves(piece, r, c)
        if king_pos in valid_moves:
          return True

  return False


# Main Game Loop
def main():
  global selected_piece, selected_pos, current_player
  initialize_board()
  clock = pygame.time.Clock()

  running = True
  while running:
    clock.tick(60)

    for event in pygame.event.get():
      if event.type == pygame.QUIT:
        running = False

      elif event.type == pygame.MOUSEBUTTONDOWN:
        x, y = pygame.mouse.get_pos()
        col = x // SQUARE_SIZE
        row = y // SQUARE_SIZE

        if selected_piece:
          valid_moves = get_valid_moves(
              selected_piece, selected_pos[0], selected_pos[1]
          )
          if (row, col) in valid_moves:
            # Move piece
            board[selected_pos[0]][selected_pos[1]] = None
            board[row][col] = selected_piece
            selected_piece.has_moved = True

            # Switch Turn
            current_player = "black" if current_player == "white" else "white"

          selected_piece = None
          selected_pos = None

        else:
          piece = board[row][col]
          if piece and piece.color == current_player:
            selected_piece = piece
            selected_pos = (row, col)

    draw_board()
    draw_pieces()
    pygame.display.flip()

  pygame.quit()
  sys.exit()


if __name__ == "__main__":
  main()